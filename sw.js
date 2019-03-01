var cacheName="qaq"
var cacheFiles=[
	'./',
	'index.html',
	'a.js',
	'vue.min.js',
	'a.css',
	'TSCu_Comic.ttf',
	'manifest.json'
]
self.addEventListener('install',e=>{
	var cachePromise=caches.open(cacheName).then(cache=>{
		cache.addAll(cacheFiles)
	})
	e.waitUntil(cachePromise)
})
self.addEventListener('fetch',e=>{
	console.log(e.request)
	e.respondWith(
		caches.match(e.request).then(cache=>{
			console.log('Cached')
			console.log(cache)
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
				console.log(key)
				return caches.delete(key)
			}
		}))
	})
	e.waitUntil(cachePromise)
	return self.clients.claim()
})