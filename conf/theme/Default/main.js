const Colors = {
    "BLUE": [213, 76.4],
    "GREEN": [147, 63.2],
    "YELLOW": [50, 91.8],
    "ORANGE": [28, 100],
    "RED": [357, 78.5],
    "PURPLE": [285, 45.1],
    "BROWN": [27, 38.2]
}

const Palette = new PaletteController(Colors);
Palette.setPaletteFrom("primary", "GREEN", 500,true);
Palette.setPaletteFrom("secondary", "BROWN", 500);

window.onload=()=>{
    /*for(let item of SelectAll("*[Em3et]")){
        Em3et.render(item);
    }*/
    renderAllCollapse();
    $.loadAll();
    hljs.highlightAll();
}