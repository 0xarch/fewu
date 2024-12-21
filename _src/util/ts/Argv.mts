interface Args {
    [key: string]: string | string[];
}

let Argv: Args = {
    0: process.argv[0],
    1: process.argv[1],
    main: []
};

let in_arg = 'main';
for(let i = 2;i<process.argv.length;i++){
    if(process.argv[i].startsWith('-')){
        in_arg = process.argv[i];
        continue;
    }
    if(!Argv[in_arg]){
        Argv[in_arg] = [];
    }
    (Argv[in_arg] as string[]).push(process.argv[i]);
}

export default Argv;