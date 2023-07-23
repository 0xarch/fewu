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
exports.CCE=(Color,Effect)=>CCE(Color,Effect);
exports.CEN=TermEnd;
exports.CTX=(Text,Color,Effect)=>CTX(Text,Color,Effect);
exports.Log={
    PICKING_UP(text,tab){
        console.log('\t'.repeat(tab)+CTX('[Picking up]','MAGENTA','BOLD')+' '+text);
    },
    PROCESSING(text,tab){
        console.log('\t'.repeat(tab)+CTX('[Processing]','YELLOW','BOLD')+' '+text);
    },
    PROGRESS(text,tab){
        console.log('\t'.repeat(tab)+CTX('[Progress]','BLUE','BOLD')+' '+text);
    },
    SUCCESS(text,tab){
        console.log('\t'.repeat(tab)+CTX('[Success]','GREEN','BOLD')+' '+text);
    },
    FINISH_TASK(text,tab){
        console.log('\t'.repeat(tab)+CTX('[Finish Task]','MAGENTA','BOLD')+' '+text);
    },
    ERROR(text,tab){
        console.log('\t'.repeat(tab)+CTX('[Error]','RED','BOLD')+' '+text);
    }
}