import { readFileSync } from "fs";
import { basename } from "path";
import { Article } from "./classes.js";
import { traverse } from "../modules/lib/hail.js";

function test(string){
    let a = new Article(string);
    console.log(a);
}

/**
 * 
 * @param {string} content 
 * @param {string} pathto 
 * @returns { Article }
 */
function initializeArticle(content,pathto=undefined) {
    let article = new Article(content);
    article.setPath(pathto);
    return article;
}

/**
 * 
 * @param {string} PostDir 
 * @param {[string]} excluded_articles
 * @returns {{articles:[Article],excluded:object}}
 */
function getAllArticles(PostDir, excluded_articles) {
    let bid = 0;
    let articles = [],
        excluded = {};
    for (let path of traverse(PostDir)) {
        let item = basename(path, PostDir);
        let file_text = readFileSync(path).toString();
        let file_data = initializeArticle(file_text,path);
        file_data.setID(bid);
        
        if (excluded_articles.includes(item)) excluded[item] = file_data;
        else articles.push(file_data);
        bid++;
    }
    let prev_id;
    articles.forEach((v,i,a)=>{
        v.setPrev(prev_id);
        prev_id = v.id;
        a[i].setNext(v.id);
    });
    return {
        articles,
        excluded
    };
}

export {
    test as __TEST01__,
    initializeArticle,
    getAllArticles
}