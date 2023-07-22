function Sort(a, b) {
    const A = a.date, B = b.date;
    const Ay = A.slice(0, 4), By = B.slice(0, 4);
    if (Ay > By) return -1;
    else if (Ay < By) return 1;
    else { // Ay = By
      const Am = A.slice(5, 7), Bm = B.slice(5, 7);
      if (Am > Bm) return -1;
      else if (Am < Bm) return 1;
      else { // Am = Bm
        return B.slice(8, 10) - A.slice(8, 10);
      }
    }
}

function getSort(POSTS){
    const SortedPosts = POSTS.sort(Sort);

    // _______ 按置顶排序 _______
    var topPosts = Array();
    var untopPosts = Array();

    SortedPosts.forEach((item) => {
    if (item.top == "true") {
        topPosts.push(item);
    } else {
        untopPosts.push(item);
    }
    });
    const DefaultPosts = topPosts.concat(untopPosts);

    // _________ 分类 _________
    const categories = new Array;
    DefaultPosts.forEach((item) => {
    if (!categories.includes(item.category)) {
        categories.push(item.category);
    }
    });
    const categoryPosts = new Array;
    categories.forEach((item) => {
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
    const incl = {
        "cate": item,
        "incl": new Array,
    };
    SortedPosts.forEach((item2) => {
        if (item2.category == item) {
        incl.incl.push(item2);
        }
    });
    categoryPosts.push(incl);
    });

    const RecentPosts=SortedPosts.slice(0,5);

    return {Posts:SortedPosts,DefaultPosts,categoryPosts,RecentPosts}
}

exports.getSort=(POSTS)=>getSort(POSTS);