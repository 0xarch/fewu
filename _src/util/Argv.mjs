let args = process.argv;
let Argv = {
    0: args[0],
    1: args[1],
    main: []
};
let in_arg = 'main';
for(let i = 2;i<args.length;i++){
    if(args[i].startsWith('-')){
        in_arg = args[i];
        continue;
    }
    if(!Argv[in_arg]){
        Argv[in_arg] = [];
    }
    Argv[in_arg].push(args[i]);
}

export default Argv;