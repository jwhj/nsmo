var cacheName="qazwsx"
var cacheFiles=[
	'vue.min.js',
	'vue-router.min.js',
	'av.min.js',
	'TSCu_Comic.ttf',
	'favicon.ico'
]
self.addEventListener('install',e=>{
	var cachePromise=caches.open(cacheName).then(cache=>{
		cache.addAll(cacheFiles)
	})
	e.waitUntil(cachePromise)
	self.skipWaiting()
})
self.addEventListener('fetch',e=>{
	e.respondWith(
		caches.match(e.request).then(cache=>{
			return cache || fetch(e.request)
		}).catch(err=>{
			console.log(err)
			return fetch(e.request)
		})
	)
})
self.addEventListener('activate',e=>{
	var cachePromise=caches.keys().then(keys=>{
		return Promise.all(keys.map(key=>{
			if (key!=cacheName){
				return caches.delete(key)
			}
		}))
	})
	e.waitUntil(cachePromise)
	return self.clients.claim()
})
