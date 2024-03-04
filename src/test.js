let str = "f3q2g12g";
let arr = ['','',''];
let hex;
while(str.length%3!=0) str+='^';
for(let i=0;i<str.length;i+=3){
    arr[0] += str[i];
    arr[1] += str[i+1];
    arr[2] += str[i+2];
}
console.log(arr);
let arr_num = arr.map(v=>{
    let sum = 0;
    for(let i=0;i<v.length;i++)
        sum += v.charCodeAt(i);
    sum = (sum%255).toString(16).padStart(2,'f');
    return sum;
});
console.log('#'+arr_num.join(''));