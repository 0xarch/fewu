function assert_eq(a,b){
    console.log(a == b)
}

let a = [1,2,3,4,1,2,3,4]
'ABC'.split('').forEach(()=>a.push(a.shift()))
a.splice(1,0,...a.splice(0,3))
let pop = a.shift()
a.splice(0,0,...[0,0,0/*N/S*/,0/*M/F*/]);
assert_eq(pop,a.pop())