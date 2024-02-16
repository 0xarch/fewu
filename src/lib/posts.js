import { readFileSync } from "fs";
import { basename } from "path";
import { Post, Tag, Category } from "./classes.js";
import { traverse } from "../modules/lib/hail.js";
import { PostSortingFunction } from "./closures.js";

function test(string) {
    let a = new Post(string);
    console.log(a);
}

/**
 * 
 * @param {string} content 
 * @param {string} pathto 
 * @returns { Post }
 */
function initializePost(content, pathto = undefined) {
    let article = new Post(content);
    article.setPath(pathto);
    return article;
}

/**
 * 
 * @param {string} PostDir 
 * @param {[string]} excluded_filename
 * @returns {{posts:[Post],excluded_posts:object,categories:[Category],tags:[Tag]}}
 */
function getAllPosts(PostDir, excluded_filename) {
    let bid = 0;
    let posts = [],
        excluded_posts = {},
        used_categories = [],
        used_tags = [],
        categories = {},
        tags = {};
    for (let path of traverse(PostDir)) {
        let item = basename(path, PostDir);
        let file_text = readFileSync(path).toString();
        let file_data = initializePost(file_text, path);
        file_data.setID(bid);


        if (excluded_filename.includes(item)) excluded_posts[item] = file_data;
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
    posts.forEach((v, i, a) => {
        v.setPrev(prev_id);
        prev_id = v.id;
        a[i - 1] && a[i - 1].setNext(v.id);
    });
    console.log(used_categories, used_tags);
    return {
        posts,
        excluded_posts,
        categories,
        tags,
        category_count: used_categories.length,
        tag_count: used_tags.length
    };
}

function sort(posts) {
    const byPostDate = posts.sort(PostSortingFunction);
    let ID = {};
    let defaultOrder = byPostDate.map(v => {
        ID[v.id] = v;
        return v.id;
    });

    // order in update
    let dateGroup = {};
    for (let item of byPostDate) {
        let date = new Date(item.date);
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

export {
    test as __TEST01__,
    initializePost,
    getAllPosts,
    sort
}