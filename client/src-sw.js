const { warmStrategyCache } = require('workbox-recipes')
const { CacheFirst } = require('workbox-strategies')
const { registerRoute } = require('workbox-routing')
const { CacheableResponsePlugin } = require('workbox-cacheable-response')
const { ExpirationPlugin } = require('workbox-expiration')
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute')

precacheAndRoute(self.__WB_MANIFEST)

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
})

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
})

registerRoute(
  // Define a route for your assets, for example, JS and CSS files
  ({ request }) =>
    request.destination === 'script' || request.destination === 'style',
  // Use a CacheFirst strategy for assets
  new CacheFirst({
    cacheName: 'assets-cache', // Name for the cache
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], // Cache successful responses
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for 7 days
      }),
    ],
  })
)
