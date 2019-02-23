function range(a,b,step=1){
	var res=[]
	for (var i=a; i<b; i+=step) res.push(i)
	return res
}
function randint(a,b){
	return Math.floor(Math.random()*(b-a)+a+1e-6)
}
function tick(){
	if (vm.gs!=1 || vm.ps!='game') return
	++vm.tm
	setTimeout(tick,1000)
}
function check(){
	for (var i=0; i<vm.n*vm.n-1; ++i)
		if (vm.a[i]!=i+1) return false
	return true
}
function _move(i,j,flag){
	if (vm.gs==2 && !flag) return
	if (vm.gs==0){
		setTimeout(tick,1000)
		vm.gs=1
	}
	var di=[-1,1,0,0],dj=[0,0,-1,1]
	for (var w=0; w<4; ++w){
		var ni=i+di[w],nj=j+dj[w]
		if (0<=ni && ni<vm.n && 0<=nj && nj<vm.n){
			var x=i*vm.n+j,y=ni*vm.n+nj
			if (vm.a[y]==0){
				Vue.set(vm.a,y,vm.a[x])
				Vue.set(vm.a,x,0)
				++vm.stp
				if (!flag && check()){
					vm.gs=2
					var rec=JSON.parse(localStorage.rec || '{}')
					if (rec[vm.n]){
						rec[vm.n].m=Math.min(rec[vm.n].m,vm.stp)
						rec[vm.n].t=Math.min(rec[vm.n].t,vm.tm)
					}
					else rec[vm.n]={m:vm.stp,t:vm.tm}
					localStorage.rec=JSON.stringify(rec)
				}
				return
			}
		}
	}
}
function move(x,y,flag){
	for (var i=0; i<vm.n; ++i)
		if (!vm.a[i*vm.n+y]){
			if (i<x) for (var u=i+1; u<=x; ++u) _move(u,y,flag)
			else if (i>x) for (var u=i-1; u>=x; --u) _move(u,y,flag)
			return
		}
	for (var j=0; j<vm.n; ++j)
		if (!vm.a[x*vm.n+j]){
			if (j<y) for (var v=j+1; v<=y; ++v) _move(x,v,flag)
			else if (j>y) for (var v=j-1; v>=y; --v) _move(x,v,flag)
			return
		}
}
function initGame(flag){
	if (!flag){
		vm.a=range(1,vm.n*vm.n).concat(0)
		for (var p=0; p<100*vm.n*vm.n; ++p){
			move(randint(0,vm.n),randint(0,vm.n),1)
		}
		vm.b=Array.from(vm.a)
	}
	else{
		vm.a=Array.from(vm.b)
	}
	vm.gs=0
	vm.stp=0
	vm.tm=0
}
function saveConfig(){
	localStorage.n=vm.n;
}