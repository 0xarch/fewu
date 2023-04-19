const POSTS=require("./post").POSTS.sort(sortByDate);

function sortByDate(a,b){
    return a.date.slice(0,4)*365+a.date.slice(5,7)*30+a.date.slice(8,10)-b.date.slice(0,4)*365+b.date.slice(5,7)+b.date.slice(8,10);
}

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

exports.RECENT_POSTS=POSTS;
exports.DEFAULT_POSTS=DEFAULT_POSTS;