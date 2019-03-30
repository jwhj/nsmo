function range(a,b,step=1){
	var res=[]
	for (var i=a; i<b; i+=step) res.push(i)
	return res
}
function randint(a,b){
	return Math.floor(Math.random()*(b-a)+a+1e-6)
}
function tick(){
	if (this.gs!=1 || vm.$route.path!='/game') return
	++this.tm
	setTimeout(this.tick,1000)
}
function check(){
	for (var i=0; i<this.n*this.n-1; ++i)
		if (this.a[i]!=i+1) return false
	return true
}
function merge(a,b){
	for (x in b)
		if (!(x in a)) a[x]=b[x]
		else{
			a[x].m=Math.min(a[x].m,b[x].m)
			a[x].t=Math.min(a[x].t,b[x].t)
		}
	return a
}
function _move(i,j,flag){
	if (this.gs==2 && !flag) return
	if (this.gs==0){
		setTimeout(this.tick,1000)
		this.gs=1
	}
	var di=[-1,1,0,0],dj=[0,0,-1,1]
	for (var w=0; w<4; ++w){
		var ni=i+di[w],nj=j+dj[w]
		if (0<=ni && ni<this.n && 0<=nj && nj<this.n){
			var x=i*this.n+j,y=ni*this.n+nj
			if (this.a[y]==0){
				Vue.set(this.a,y,this.a[x])
				Vue.set(this.a,x,0)
				++this.stp
				if (!flag && this.check()){
					this.gs=2
					// if (rec[this.n]){
					// 	rec[this.n].m=Math.min(rec[this.n].m,this.stp)
					// 	rec[this.n].t=Math.min(rec[this.n].t,this.tm)
					// }
					// else rec[this.n]={m:this.stp,t:this.tm}
					const newRec={[this.n]:{m:this.stp,t:this.tm}}
					localStorage.rec=JSON.stringify(merge(rec,newRec))
				}
				return
			}
		}
	}
}
function move(x,y,flag){
	for (var i=0; i<this.n; ++i)
		if (!this.a[i*this.n+y]){
			if (i<x) for (var u=i+1; u<=x; ++u) this._move(u,y,flag)
			else if (i>x) for (var u=i-1; u>=x; --u) this._move(u,y,flag)
			return
		}
	for (var j=0; j<this.n; ++j)
		if (!this.a[x*this.n+j]){
			if (j<y) for (var v=j+1; v<=y; ++v) this._move(x,v,flag)
			else if (j>y) for (var v=j-1; v>=y; --v) this._move(x,v,flag)
			return
		}
}
function initGame(flag){
	if (!flag){
		this.a=range(1,this.n*this.n).concat(0)
		for (var p=0; p<100*this.n*this.n; ++p){
			this.move(randint(0,this.n),randint(0,this.n),1)
		}
		this.b=Array.from(this.a)
	}
	else{
		this.a=Array.from(this.b)
	}
	this.gs=0
	this.stp=0
	this.tm=0
}
function saveConfig(){
	localStorage.n=config.n;
}
async function getCloudScore(){
	const q=new AV.Query(AV.User)
	return (await q.get(AV.User.current().id)).get('test') || {}
}
async function uploadScore(){
	const cloudRec=await getCloudScore()
	AV.User.current().set('test',merge(cloudRec,rec))
	AV.User.current().save()
}
async function syncScoreFromCloud(){
	const cloudRec=await getCloudScore()
	localStorage.rec=JSON.stringify(merge(rec,cloudRec))
}