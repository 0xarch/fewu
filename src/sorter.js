const POSTS=require("./post").POSTS.sort(sortByDate); // 按时间排序
const LOG=console.log;

// ____ 比较函数 ____
function sortByDate(a,b){
    const A=a.date,B=b.date;
    const Ay=A.slice(0,4),By=B.slice(0,4);
    if ( Ay > By ) return -1;
    else if ( Ay < By ) return 1;
    else { // Ay = By
        const Am=A.slice(5,7),Bm=B.slice(5,7);
        if ( Am > Bm ) return -1;
        else if ( Am < Bm ) return 1;
        else { // Am = Bm
            return B.slice(8,10) - A.slice(8,10);
        }
    };
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
LOG("<Success> sort by top");

// _________ 分类 _________
const categories=[];
POSTS.forEach(item=>{
    if(!categories.includes(item.category)){
        categories.push(item.category);
    }
});
const categoryPosts=[];
categories.forEach(item=>{
    /*
        categoryPosts的结构比较特殊：
        [ 
            {
                cate:分类名,
                incl:[ ...包含在该分类中的博客... ]
            },
            { ... },
            ...
        ]
    */
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
LOG("<Success> Sort by category");

// ________ EXPORT ________
exports.topPosts=topPosts;
exports.categoryPosts=categoryPosts;
exports.RecentPosts=POSTS.slice(0,5);
exports.DefaultPosts=DEFAULT_POSTS;
exports.Posts=POSTS;