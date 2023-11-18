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
    Processing(text,tab){
        console.log('\t'.repeat(tab)+CTX('[Processing]','YELLOW','BOLD')+' '+text);
    },
    Progress(text,tab){
        console.log('\t'.repeat(tab)+CTX('[Progress]','BLUE','BOLD')+' '+text);
    },
    Success(text,tab){
        console.log('\t'.repeat(tab)+CTX('[Success]','GREEN','BOLD')+' '+text);
    },
    FinishTask(text,tab){
        console.log('\t'.repeat(tab)+CTX('[Finish Task]','MAGENTA','BOLD')+' '+text);
    },
    Error(text,tab){
        console.log('\t'.repeat(tab)+CTX('[Error]','RED','BOLD')+' '+text);
    },
    PickingUp(text,tab){
        console.log('\t'.repeat(tab)+CTX('[Picking up]','MAGENTA','BOLD')+' '+text);
    },
    out(text1,color1,text2,tab){
        console.log('\t'.repeat(tab)+CTX(text1,color1,'BOLD')+' '+text2);
    },
}
exports.console={
    log:(...text)=>{
        console.log(CTX('LOG','GREEN','BOLD'),'   - ',text.join(" "));
    },
    dbg:(...text)=>{
        console.log(CTX('DEBUG','RED','BOLD'),' - ',text.join(" "));
    },
    warn:(...text)=>{
        console.log(CTX('WARN','YELLOW','BOLD'),'  - ',text.join(" "));
    }
}