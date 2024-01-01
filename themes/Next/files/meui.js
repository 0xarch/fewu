document.addEventListener('DOMContentLoaded',()=>{
    try{
        MEUI.components.drawer.create(document.getElementById('binding-d0'),document.getElementById('binding-d1'));
    } catch(e) {
    }
    try{
        MEUI.compkits.dwt();
    }catch(e) {}
    MEUI.browse.darkModeSettings.setMode();
    MEUI.browse.windowSettings.detectShrink();
    window.onresize = function(){
        MEUI.browse.windowSettings.debounced.detectShrink();
    }
})