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
 * @param  {...[CONTENT:any,COLOR:string,EFFECT:string]} ARG 
 */
function error(...ARG) {
    console.error(SHELL_STYLE('ERROR', 'RED'), ...ARG.map(v => (v instanceof Array)?SHELL_STYLE(...v):v));
}

const ErrorLogger = {
    couldNotLoadTheme: ()=>{
        error('Could not load theme configuration file. Do you have the specific theme in _themes directory?');
    },
    couldNotLoadConfig: ()=>{
        error('Could not load configuration file. Did you run',['fewu --init','GREEN'],'before generation?');
    },
    couldNotLoadModule: (name)=>{
        error('Could not load module:',[name,'YELLOW']);
    },
    couldNotLoadPlugin: ()=>{
        error('An error occured during loading plugin.');
    },
    couldNotLoadI18nDefault: ()=>{
        error('Could not read default(fallback) i18n file in theme directory $THEME/extra/i18n.default.json');
    },
    couldNotLoadI18nFile: ()=>{
        error('Could not read i18n file in theme directory $THEME/extra/i18n.'+database.language+'.json');
    }
}

export default ErrorLogger;