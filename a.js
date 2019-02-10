function range(a,b,step=1){
	var res=[]
	for (var i=a; i<b; i+=step) res.push(i)
	return res
}
function randint(a,b){
	return Math.floor(Math.random()*(b-a)+a+1e-6)
}
function tick(){
	if (vm.gs!=1) return
	++vm.tm
	setTimeout(tick,1000)
}
function check(){
	for (var i=0; i<vm.n*vm.n-1; ++i)
		if (vm.a[i]!=i+1) return false
	return true
}
function move(i,j){
	if (vm.gs==2) return
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
				if (check()){
					vm.gs=2
				}
				return
			}
		}
	}
}
function initGame(flag){
	if (!flag){
		vm.a=range(1,vm.n*vm.n).concat(0)
		for (var p=0; p<100*vm.n*vm.n; ++p){
			move(randint(0,vm.n),randint(0,vm.n))
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
function backup(flag){
	if (!flag && document.visibilityState!='hidden') return
	if (location.href.indexOf('#clearcache')!=-1){
		localStorage.removeItem('vm')
		return
	}
	localStorage.vm=JSON.stringify(vm._data)
}