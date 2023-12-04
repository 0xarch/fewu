const TermColor={
    GREY:'30',RED:'31',
    GREEN:'32',YELLOW:'33',
    BLUE:'34',MAGENTA:'35',
    LIGHTBLUE:'36',LIGHTGREY:'38',
};
const TermEffect={
    BOLD:'1'
};
const TermEnd=`\x1b[0m`;
const CCE=(Color,Effect)=>`\x1b[${TermColor[Color]};${Effect?TermEffect[Effect]:""}m`;
const CTX=(Text,Color,Effect)=>CCE(Color,Effect)+Text+TermEnd;
exports.CCE=CCE;
exports.CEN=TermEnd;
exports.CTX=CTX;
exports.log = (...text) => 
    console.log('LOG'+'   '+text.join(" - "));
exports.dbg = (...text) =>
    console.log('DBG'+'   '+text.join(" - "));
exports.err = (...text) =>
    console.error('ERR'+'   '+text.join(" - "));
exports.nextline = () =>console.log('\n');

/**
 * 
 * @param { string[] } argv 
 */
exports.gopt = (argv) =>{
    let len = argv.length;
    let args = {};
    for(let i = 1;i<len;i++){
        if(argv[i][0] == '-' && argv[i][1] == '-'){
            let arg_key = argv[i].slice(2,argv[i].length);
            i++;
            if(argv[i] == undefined){
                args[arg_key] = 'null';
                continue;
            }else{
                if(argv[i][0] != '-'){
                    args[arg_key]=argv[i];
                }else{
                    args[arg_key]='null';
                }
            }
            
        }else{
            args[i] = argv[i];
        }
    }
    return args;
}