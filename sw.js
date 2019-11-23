importScripts('https://cdn.jsdelivr.net/npm/workbox-sw@4.3.1/build/workbox-sw.min.js')
if (workbox) console.log('Workbox loaded.')
else console.log('Failed to load workbox.')
workbox.routing.registerRoute(
	({ url, evt }) => {
		return url.pathname !== '/sw.js'
	},
	new workbox.strategies.StaleWhileRevalidate()
)