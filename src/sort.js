const UTILS=require("./utils");

function Sort(a, b) {
    const A = a.date,
        B = b.date;
    const Ay = A.slice(0, 4),
        By = B.slice(0, 4);
    if (Ay > By) return -1;
    else if (Ay < By) return 1;
    else { // Ay = By
        const Am = A.slice(5, 7),
            Bm = B.slice(5, 7);
        if (Am > Bm) return -1;
        else if (Am < Bm) return 1;
        else { // Am = Bm
            return B.slice(8, 10) - A.slice(8, 10);
        }
    }
}

function getSort(POSTS) {
    const SortedPosts = POSTS.sort(Sort);
    UTILS.Log.PickingUp("Sorting Posts",1);

    // ______ BID & 最近 & 默认 ______
    const BID = {};
    for (let item of POSTS) {
        BID[item.bid] = item;
    }
    const RecentPosts = SortedPosts.slice(0, 5);
    const Sorted = [];
    for(let item of SortedPosts)Sorted.push(item.bid);

    // _______ 置顶 _______
    var topPosts = Array();
    var untopPosts = Array();

    SortedPosts.forEach((item) => {
        if (item.top == "true") {
            topPosts.push(item.bid);
        } else {
            untopPosts.push(item.bid);
        }
    });
    const DefaultPosts = topPosts.concat(untopPosts);
    UTILS.Log.Progress("Sorted by default",2);

    // _________ 分类 _________
    const categories = new Array;
    DefaultPosts.forEach(item => {
        item=BID[item];
        for(let category of item.category)
            if (!categories.includes(category)) {
                categories.push(category);
            }
    });
    const CategoryPosts = new Array;
    categories.forEach((item) => {
        /*
                categoryPosts的结构比较特殊：
                [
                    {
                        cate:分类名,
                        incl:[ ...包含在该分类中的博客BID... ]
                    },
                    { ... },
                    ...
                ]
            */
        const incl = {
            "cate": item,
            "incl": new Array,
        };
        SortedPosts.forEach((item2) => {
            if (item2.category.includes(item)) {
                incl.incl.push(item2.bid);
            }
        });
        CategoryPosts.push(incl);
    });
    // new
    const byCategory = {};
    categories.forEach(item=>{
        /*
            新的 Sorts.byCategory 的结构：
            {
                "分类名" : [ ...包含在该分类中的博客BID... ],
                ...
            }
        */
        byCategory[item] = [];
        SortedPosts.forEach(item2=>{
            if(item2.category.includes(item))
                byCategory[item].push(item2.bid);
        });
    });
    UTILS.Log.Progress("Sorted by category",2);

    // ______ 日期 ______
    const SortedByDate = {};
    for(let item of POSTS){
        let date = new Date(item.date);
        let year = date.getFullYear(),month=date.getMonth()+1,day=date.getDate();
        if(!SortedByDate[year])SortedByDate[year]={};
        if(!SortedByDate[year][month])SortedByDate[year][month]={};
        if(!SortedByDate[year][month][day])SortedByDate[year][month][day]=new Array;
        SortedByDate[year][month][day].push(item.bid);
    }
    UTILS.Log.Progress("Sorted by date",2);

    UTILS.Log.FinishTask("Sorted posts by specfic orders",1);

    return {
        Posts: SortedPosts,
        DefaultPosts,
        CategoryPosts,
        byCategory,
        RecentPosts,
        SortedByDate,
        Sorted,
        BID
    }
}

exports.getSort = (POSTS) => getSort(POSTS);