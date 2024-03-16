let _M_ = false;['Android','iPhone','Mobi','webOS','iPod','BlackBerry'].forEach(v=>navigator.userAgent.includes(v)&&(_M_=true));
const Q=(v,s)=>v.querySelector(s),D=document;const debug=()=>D.body.setAttribute('debug',0);const mobile=()=>{_M_=!_M_;D.documentElement.setAttribute('isMobile',_M_);}
D.documentElement.setAttribute('isMobile',_M_);

function Search(){let p=Q(D,'#searchPanel'),t;let c=Q(p,'.--P'),i=Q(p,'input');let f=async()=>{let r=new Map;c.innerHTML='';let iv=i.value;if(!iv)return;!t&&(t=JSON.parse(await(await fetch(Q(D,'#searchUrl').innerHTML)).text()));t.forEach(v=>v.content.toString().includes(iv)&&r.set(v.atitle,v.href));for(let[k,v]of r)c.innerHTML+=`<a href="${v}" class='Row'>${k}</a><hr>`};Q(p,'.--S').onclick=f;i.onkeydown=(e)=>{e.key=='Enter'&&f()}}
document.addEventListener('DOMContentLoaded',()=>{try{Search()}catch(e){console.error(e)}})