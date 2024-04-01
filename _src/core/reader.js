import { basename, join } from "path";
import * as fs from "fs";
import db from "#db";
import { Category, Tag } from "#struct";
import Post from "#class/post";

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
    let article = new Post(content, id);
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
    let categoriesMap = new Map,
        tagsMap = new Map;
    for (let path of traverse(db.dirs.posts)) {
        let item = basename(path, db.dirs.posts);
        let file_data = initializePost(path, bid);

        if (db.config.excluded_posts.includes(item)){
            excluded_posts[item] = file_data;
        } else {
            for (let cname of file_data.category) {
                if (used_categories.includes(cname)) {
                    categories[cname].add(file_data.id);
                    categoriesMap.get(cname).add(file_data.id);
                } else {
                    categoriesMap.set(cname,new Category(cname, [file_data.id]));
                    categories[cname] = categoriesMap.get(cname);
                    used_categories.push(cname);
                }
            }

            for (let cname of file_data.tags) {
                if (used_tags.includes(cname)) {
                    tags[cname].add(file_data.id);
                    tagsMap.get(cname).add(file_data.id);
                } else {
                    tagsMap.set(cname,new Tag(cname, [file_data.id]));
                    tags[cname] = tagsMap.get(cname);
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
    /**
     * @type {Map<number,Post>}
     */
    let ID = new Map;
    posts.forEach(v=>{
        ID.set(v.id,v);
    });
    return {
        posts,
        excluded_posts,
        categories,
        tags,
        category_count: used_categories.length,
        tag_count: used_tags.length,
        used_categories,
        used_tags,
        ID
    };
}

function sort(posts) {
    const byPostDate = posts;
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
 * @param {string} file_dir 
 * @returns {string}
 */
function get_file_relative_dir(file_dir) {
    if (!file_dir) return db.dirs.root + '/';
    if (file_dir.startsWith('/'))
        file_dir = file_dir.substring(1);
    return join(db.dirs.root, '/', file_dir);
}

export {
    site,
    sort,
    get_file_relative_dir
}