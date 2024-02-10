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

function throttle(func, delay) {
    let timer;
    return function () {
        if (timer) return
        timer = setTimeout(() => {
            func.call(this, ...arguments);
            timer = null
        }, delay);
    }
}
document.documentElement.setAttribute('isMobile',__isMobile);