import { basename,join } from "path";
import * as fs from "fs";
import db from "./database.js";
import Post from "../lib/class.post.js";
import { Category,Tag } from "./descriptive_class.js";

function traverse(Directory) {
    let returns = [];
    for (let item of fs.readdirSync(Directory)) {
        let path = join(Directory, item);
        let stat = fs.statSync(path);
        if (stat.isDirectory()) returns.push(...traverse(path));
        else returns.push(path);
    }
    return returns;
}

/**
 * 
 * @param {string} content 
 * @param {number} id
 * @returns { Post }
 */
function initializePost(content, id = undefined) {
    let article = new Post(content,id);
    return article;
}

/**
 * 
 * @returns {{posts:[Post],excluded_posts:object,categories:[Category],tags:[Tag]}}
 */
function site() {
    let bid = 1;
    let posts = [],
        excluded_posts = {},
        used_categories = [],
        used_tags = [],
        categories = {},
        tags = {};
    for (let path of traverse(db.dirs.posts)) {
        let item = basename(path, db.dirs.posts);
        let file_data = initializePost(path,bid);

        if (db.settings.get('excluded_posts').includes(item)) excluded_posts[item] = file_data;
        else {
            for (let cname of file_data.category) {
                if (used_categories.includes(cname)) {
                    categories[cname].add(file_data.id);
                } else {
                    categories[cname] = new Category(cname, [file_data.id]);
                    used_categories.push(cname);
                }
            }

            for (let cname of file_data.tags) {
                if (used_tags.includes(cname)) {
                    tags[cname].add(file_data.id);
                } else {
                    tags[cname] = new Tag(cname, [file_data.id]);
                    used_tags.push(cname);
                }
            }
            posts.push(file_data);
        }
        bid++;
    }
    let prev_id;
    posts.sort(Post.sort);
    posts.forEach((v, i, a) => {
        v.setPrev(prev_id);
        prev_id = v.id;
        a[i - 1] && a[i - 1].setNext(v.id);
    });
    return {
        posts,
        excluded_posts,
        categories,
        tags,
        category_count: used_categories.length,
        tag_count: used_tags.length,
        used_categories,
        used_tags
    };
}

function sort(posts) {
    const byPostDate = posts.sort(Post.sort);
    let ID = {};
    let defaultOrder = byPostDate.map(v => {
        ID[v.id] = v;
        return v.id;
    });

    // order in update
    let dateGroup = {};
    for (let item of byPostDate) {
        let date = item.date;
        let y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
        if (!dateGroup[y]) {
            dateGroup[y] = {};
        }
        if (!dateGroup[y][m]) {
            dateGroup[y][m] = {};
        }
        if (!dateGroup[y][m][d]) {
            dateGroup[y][m][d] = [];
        }
        dateGroup[y][m][d].push(item.id);
    }

    return {
        defaultOrder,
        dateGroup,
        ID
    }
}

/**
 * 
 * @param {string} content 
 * @since 2.0
 */
function word_count(content){
    let count = 0;
    let en_char = /[A-z]+/;
    content.replace(/[\u4E00-\u9FA5]/g,(e,i)=>{count++;content=content.substring(0,i)+' '+content.substring(i+1)});
    let arr = content.split(" ").filter(v=>v!='');
    arr.forEach(v=>en_char.test(v)&&count++);
    return count;
}
export {
    site,
    sort,
    word_count
}