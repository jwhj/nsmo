function range(l, r, step = 1) {
	var ans = []
	for (var i = l; i < r; i += step) ans.push(i)
	return ans
}
function randint(a, b) {
	return Math.floor(Math.random() * (b - a) + a + 1e-6)
}
function merge(a, b, mode) {
	if (mode == 1)
		a = a.blind
	for (let x in b)
		if (!(x in a)) a[x] = b[x]
		else {
			a[x].m = Math.min(a[x].m, b[x].m)
			a[x].t = Math.min(a[x].t, b[x].t)
		}
	return a
}
async function getCloudScore() {
	const q = new AV.Query(AV.User)
	return (await q.get(AV.User.current().id)).get('test') || {}
}
const config = {
	n: Number(localStorage.n) || 3,
	mode: Number(localStorage.mode) || 0
}
const rec = JSON.parse(localStorage.rec || '{}')
if (!rec.blind) rec.blind = {}
var rec1 = config.mode ? rec.blind : rec
const appId = 'idl1yBaD2ckrrgqYYhbyW13G-gzGzoHsz'
const appKey = 'mSFDubuva14YnvmkELOWBBU1'
AV.init({ appId, appKey })
const Menu = {
	template: '#MenuTpl',
	data() {
		return {
			config
		}
	},
	methods: {
		toggleMode() {
			this.config.mode ^= 1
			rec1 = config.mode ? rec.blind : rec
			localStorage.mode = config.mode
		}
	}
}
const Game = {
	template: '#GameTpl',
	data() {
		return {
			config,
			rec,
			a: [],
			b: [],
			stp: 0,
			tm: 0,
			gs: 0,
			wd: '300px'
		}
	},
	computed: {
		n() {
			return config.n
		},
		ew() {
			return Math.floor(99 / this.n + 1e-6) + '%'
		}
	},
	methods: {
		calc(i, j) {
			if (this.config.mode == 1 && this.gs == 1) return ''
			var ans = this.a[i * this.n + j]
			return ans ? ans : ''
		},
		tick() {
			if (this.gs != 1 || vm.$route.path != '/game') return
			++this.tm
			setTimeout(this.tick, 1000)
		},
		check() {
			for (var i = 0; i < this.n * this.n - 1; ++i)
				if (this.a[i] != i + 1) return false
			return true
		},
		_move(i, j, flag) {
			if (this.gs == 2 && !flag) return
			if (this.gs == 0) {
				setTimeout(this.tick, 1000)
				this.gs = 1
			}
			var di = [-1, 1, 0, 0], dj = [0, 0, -1, 1]
			for (var w = 0; w < 4; ++w) {
				var ni = i + di[w], nj = j + dj[w]
				if (0 <= ni && ni < this.n && 0 <= nj && nj < this.n) {
					var x = i * this.n + j, y = ni * this.n + nj
					if (this.a[y] == 0) {
						Vue.set(this.a, y, this.a[x])
						Vue.set(this.a, x, 0)
						++this.stp
						if (!flag && this.check()) {
							this.gs = 2
							// if (rec[this.n]){
							// 	rec[this.n].m=Math.min(rec[this.n].m,this.stp)
							// 	rec[this.n].t=Math.min(rec[this.n].t,this.tm)
							// }
							// else rec[this.n]={m:this.stp,t:this.tm}
							const newRec = { [this.n]: { m: this.stp, t: this.tm } }
							localStorage.rec = JSON.stringify(merge(rec, newRec, this.config.mode))
						}
						return
					}
				}
			}
		},
		move(x, y, flag) {
			for (var i = 0; i < this.n; ++i)
				if (!this.a[i * this.n + y]) {
					if (i < x) for (let u = i + 1; u <= x; ++u) this._move(u, y, flag)
					else if (i > x) for (let u = i - 1; u >= x; --u) this._move(u, y, flag)
					return
				}
			for (var j = 0; j < this.n; ++j)
				if (!this.a[x * this.n + j]) {
					if (j < y) for (let v = j + 1; v <= y; ++v) this._move(x, v, flag)
					else if (j > y) for (let v = j - 1; v >= y; --v) this._move(x, v, flag)
					return
				}
		},
		initGame(flag) {
			if (!flag) {
				this.a = range(1, this.n * this.n).concat(0)
				for (var p = 0; p < 100 * this.n * this.n; ++p) {
					this.move(randint(0, this.n), randint(0, this.n), 1)
				}
				this.b = Array.from(this.a)
			}
			else {
				this.a = Array.from(this.b)
			}
			this.gs = 0
			this.stp = 0
			this.tm = 0
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.initGame()
		})
	}
}
const Statistics = {
	template: '#StatisticsTpl',
	data() {
		return {
			config,
			rec
		}
	},
	mounted() {
	}
}
const Cloud = {
	template: '#CloudTpl',
	data() {
		return {
			user: null,
			userName: '',
			password: ''
		}
	},
	methods: {
		login() {
			AV.User.logIn(this.userName, this.password).then(res => {
				this.password = ''
				this.user = res
			}).catch(console.log)
		},
		uploadScore: async function () {
			const cloudRec = await getCloudScore()
			AV.User.current().set('test', merge(cloudRec, rec))
			AV.User.current().save()
		},
		syncScoreFromCloud: async function () {
			const cloudRec = await getCloudScore()
			localStorage.rec = JSON.stringify(merge(rec, cloudRec))
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.user = AV.User.current()
		})
	}
}
const Settings = {
	template: '#SettingsTpl',
	data() {
		return {
			config
		}
	},
	methods: {
		saveConfig() {
			localStorage.n = config.n
		}
	}
}
const routes = [
	{ path: '/', component: Menu },
	{ path: '/game', component: Game },
	{ path: '/statistics', component: Statistics },
	{ path: '/cloud', component: Cloud },
	{ path: '/settings', component: Settings }
]
const router = new VueRouter({ routes })
var vm = new Vue({
	router,
	el: '#app',
	data: {
		isIOS: 0
	}
})
if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
	vm.isIOS = 1
}
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('sw.js')
}