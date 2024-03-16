/**
 * 
 * @param { string[] } argv 
 */
const gopt = (argv) =>{
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

export {
    gopt
}