import database from "#database";
import NewPromise from "#util/NewPromise";
import ExtendedFS from "#util-ts/ExtendedFS";

import { basename, join, extname } from "path";
import { Category, Tag } from "#struct";
import Post from "#class/post";


/**
 * 
 * @param {string} content 
 * @param {number} id
 * @returns { Promise<Post> }
 */
async function initializePost(content, id = undefined) {
    let article = new Post(content, id);
    let {promise,resolve} = NewPromise.withResolvers();
    await article.done;
    article.done.then(()=>{
        resolve(article)
    })
    return promise;
}

/**
 * 
 * @returns {{posts:[Post],excluded_posts:object,categories:[Category],tags:[Tag]}}
 */
async function site() {
    await database.initDone();
    const POST_DIRECTORY = database.data.directory.postDirectory;
    const EXCLUDED_POSTS = database.data.general.config.excluded_posts ?? [];
    let bid = 1;
    let posts = [],
        excluded_posts = {},
        used_categories = [],
        used_tags = [],
        categories = {},
        tags = {};
    let categoriesMap = new Map,
        tagsMap = new Map;
    let postPaths = (await ExtendedFS.traverse(POST_DIRECTORY)).value;
    for (let path of postPaths) {
        if(extname(path) != '.md') continue;
        let item = basename(path, POST_DIRECTORY);
        let file_data = await initializePost(path, bid);

        if (EXCLUDED_POSTS.includes(item)){
            excluded_posts[item] = file_data;
        } else {
            for (let cname of file_data.category) {
                if (used_categories.includes(cname)) {
                    categoriesMap.get(cname).add(file_data.id);
                } else {
                    categoriesMap.set(cname,new Category(cname, [file_data.id]));
                    used_categories.push(cname);
                }
            }

            for (let cname of file_data.tags) {
                if (used_tags.includes(cname)) {
                    tagsMap.get(cname).add(file_data.id);
                } else {
                    tagsMap.set(cname,new Tag(cname, [file_data.id]));
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
        if(a[i-1]){
            a[i-1].setNext(v.id);
        }
    });
    /**
     * @type {Map<number,Post>}
     */
    let ID = new Map;
    posts.forEach(v=>{
        ID.set(v.id,v);
    });

    categoriesMap.forEach((v,k)=>{
        v.sort(ID);
        categories[k] = v; // old compat
    });
    tagsMap.forEach((v,k)=>{
        v.sort(ID);
        tags[k] = v; // old compat
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
    const ROOT_DIRECTORY = database.data.directory.buildRootDirectory;
    if (!file_dir) return ROOT_DIRECTORY + '/';
    if (file_dir.startsWith('/'))
        file_dir = file_dir.substring(1);
    return join(ROOT_DIRECTORY, '/', file_dir);
}

export {
    site,
    sort,
    get_file_relative_dir
}
