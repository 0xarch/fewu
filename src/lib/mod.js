// TERMINAL OPTIONS
const TERMINAL_STYLE_END=`\x1b[0m`;
const TERMINAL_COLOR={
    BLACK:'30',RED:'31',
    GREEN:'32',YELLOW:'33',
    BLUE:'34',MAGENTA:'35',
    CYAN:'36',LIGHTGREY:'37',
    WHITE:'39'
};
const TERMINAL_EFFECT={
    BOLD:';1',
    ITALIC:';3',
    UNDERLINE:';4',
    NONE: ''
};
function SHELL_STYLE(CONTENT,COLOR='WHITE',EFFECT='NONE'){
    return `\x1b[${TERMINAL_COLOR[COLOR]}${TERMINAL_EFFECT[EFFECT]}m${CONTENT}${TERMINAL_STYLE_END}`;
}

/**
 * 
 * @param { number } num 
 */
function errno(num){
    console.log('Error ['+SHELL_STYLE(num,'RED','BOLD')+']');
}

/**
 * 
 * @param  {...[CONTENT:any,COLOR:string,EFFECT:string]} ARG 
 */
function info(...ARG){
    console.log(SHELL_STYLE('INFO','GREEN','NONE'),...ARG.map(v=>SHELL_STYLE(...v)));
}

/**
 * 
 * @param { Function } fn 
 * @param { number } err_num 
 */
function run(fn,err_num){
    try {
        fn();
    } catch(e){
        errno(err_num?err_num:'void');
    }
}

/**
 * @param {fs.PathLike} path
 * @returns {object}
 */
function load(path){

}

function nexo_logo(){
    return `<svg nexo-logo xmlns='http://www.w3.org/2000/svg' width=48 height=48><linearGradient id=nexog1 gradientTransform="rotate(45)"><stop offset=.7 stop-color=#3273d2 /><stop stop-color=#0546a5 /></linearGradient><circle n2 cx=21 cy=27 r=18 /><circle cx=21 cy=27 r=12 /><circle n2 cx=33 cy=15 r=12 /><circle cx=33 cy=15 r=8 /></svg><style>svg[nexo-logo],svg[nexo-logo]>*{background:#fff;fill:#fff}svg[nexo-logo]>*[n2]{fill:url(#nexog1)}</style>`;
}

export {
    errno,
    info,
    run,
    nexo_logo
}