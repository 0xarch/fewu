const POSTS=require("./post").POSTS.sort(sortByDate);
const LOG=console.log;

function sortByDate(a,b){
    return a.date.slice(0,4)*365+a.date.slice(5,7)*30+a.date.slice(8,10)-b.date.slice(0,4)*365+b.date.slice(5,7)+b.date.slice(8,10);
}

// _______ 按置顶排序 _______
var topPosts=Array();
var untopPosts=Array();

POSTS.forEach(item=>{
    if (item.top=="true"){
        topPosts.push(item);
    } else {
        untopPosts.push(item);
    }
});
const DEFAULT_POSTS=topPosts.concat(untopPosts);
LOG("Sort posts by top");

// _________ 分类 _________
const categories=[];
POSTS.forEach(item=>{
    if(!categories.includes(item.category)){
        categories.push(item.category);
    }
});
const categoryPosts=[];
categories.forEach(item=>{
    const incl={
        "cate":item,
        "incl":[]
    };
    POSTS.forEach(item2=>{
        if(item2.category==item){
            incl.incl.push(item2);
        }
    });
    categoryPosts.push(incl);
});
LOG("Sort posts by category");

// ________ EXPORT ________
exports.TOP_POSTS=topPosts;
exports.CATEGORY_POSTS=categoryPosts;
exports.RECENT_POSTS=POSTS;
exports.DEFAULT_POSTS=DEFAULT_POSTS;
