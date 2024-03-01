let __inDebug = false;
let __isMobile = false;
['Android','iPhone','Mobi','webOS','iPod','BlackBerry'].forEach(v=>navigator.userAgent.includes(v)?__isMobile=true:'');

function debug() {
    __inDebug = !__inDebug;
    document.body.setAttribute('debug', __inDebug);
}

function mobile(){
    __isMobile = !__isMobile;
    document.documentElement.setAttribute('isMobile',__isMobile);
}
document.documentElement.setAttribute('isMobile',__isMobile);

function generateSearch(){
    let q = document.querySelector('.com.search');
    let panel = document.getElementById('searchPanel');
    let container = panel.querySelector('.contentP');
    let input = panel.querySelector('.searchInput');
    panel.querySelector('.closeButton').addEventListener('click',function closeSearchPanel(){
        panel.removeAttribute('open');
    });
    let tempor_val;
    panel.querySelector('.onSearch').addEventListener('click',async ()=>{
        container.innerHTML = '';
        let search_content = input.value;
        if(search_content==''){
            return;
        }
        let searched = {};
        if(!tempor_val){
            let resp = await fetch(document.getElementById('searchUrl').innerHTML);
            let text = await resp.text();
            let arr = JSON.parse(text);
            tempor_val = arr;
        }
        tempor_val.forEach((v)=>{
            if(v.content.toString().includes(search_content)){
                if(!searched[v.atitle]){
                    searched[v.atitle]={};
                    searched[v.atitle].by=[];
                }
                searched[v.atitle].by.push(v.by);
                searched[v.atitle].href=v.href;
            }
        });
        for(let i in searched){
            container.innerHTML+=`<a href=${searched[i].href} class='Row'>${i}</a><hr>`;
        }
    });
    panel.open=false;
    q.querySelector('.openPanel').addEventListener('click',function openSearchPanel(){
        panel.open=true;
    });
}

document.addEventListener('DOMContentLoaded',()=>{
    try{
        generateSearch();
    } catch(e) {}
})
