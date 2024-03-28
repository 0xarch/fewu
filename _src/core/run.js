/**
 * 
 * @param { string[] } argv 
 */
const gopt = (argv) => {
    let len = argv.length;
    let args = {};
    for (let i = 1; i < len; i++) {
        if (argv[i].startsWith('--')) {
            let arg_key = argv[i].substring(2);
            if (!argv[i+1]) {
                args[arg_key] = 'null';
                break;
            } else {
                if (!argv[i+1].startsWith('--')) {
                    i++;
                    args[arg_key] = argv[i];
                } else {
                    args[arg_key] = 'null';
                }
            }
        } else {
            args[i] = argv[i];
        }
    }
    return args;
}

// TERMINAL OPTIONS
const TERMINAL_STYLE_END = `\x1b[0m`;
const TERMINAL_COLOR = {
    BLACK: '30', RED: '31',
    GREEN: '32', YELLOW: '33',
    BLUE: '34', MAGENTA: '35',
    CYAN: '36', LIGHTGREY: '37',
    WHITE: '39'
};
const TERMINAL_EFFECT = {
    BOLD: ';1',
    ITALIC: ';3',
    UNDERLINE: ';4',
    NONE: ''
};
function SHELL_STYLE(CONTENT, COLOR = 'WHITE', EFFECT = 'NONE') {
    return `\x1b[${TERMINAL_COLOR[COLOR]}${TERMINAL_EFFECT[EFFECT]}m${CONTENT}${TERMINAL_STYLE_END}`;
}

/**
 * 
 * @param { number } num 
 */
function errno(num) {
    console.log('Error [' + SHELL_STYLE(num, 'RED', 'BOLD') + ']');
}

/**
 * 
 * @param  {...[CONTENT:any,COLOR:string,EFFECT:string]} ARG 
 */
function info(...ARG) {
    console.log(SHELL_STYLE('INFO', 'GREEN', 'NONE'), ...ARG.map(v => SHELL_STYLE(...v)));
}

/**
 * 
 * @param  {...[CONTENT:any,COLOR:string,EFFECT:string]} ARG 
 */
function warn(...ARG) {
    console.log(SHELL_STYLE('WARN', 'YELLOW', 'ITALIC'), ...ARG.map(v => SHELL_STYLE(...v)));
}

/**
 * 
 * @param { Function } fn 
 * @param { number } err_num 
 */
function run(fn, err_num) {
    try {
        fn();
    } catch (e) {
        errno(err_num ? err_num : 'void');
    }
}

let logo_used_style = false;

function nexo_logo() {
    if (logo_used_style) {
        return `<svg nexo-logo xmlns='http://www.w3.org/2000/svg' width=48 height=48><circle n2 cx=21 cy=27 r=18 /><circle cx=21 cy=27 r=12 /><circle n2 cx=33 cy=15 r=12 /><circle cx=33 cy=15 r=8 /></svg><style>svg[nexo-logo]>*{fill:#fff}svg[nexo-logo]>*[n2]{fill:#3272d2}</style>`;
    }
    logo_used_style = true;
    return `<svg nexo-logo xmlns='http://www.w3.org/2000/svg' width=48 height=48><circle n2 cx=21 cy=27 r=18 /><circle cx=21 cy=27 r=12 /><circle n2 cx=33 cy=15 r=12 /><circle cx=33 cy=15 r=8 /></svg>`;
}

export {
    gopt,
    errno,
    info,
    warn,
    run,
    nexo_logo
}