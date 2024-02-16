import { Post } from "./classes.js";
/**
 * 
 * @param {Post} a 
 * @param {Post} b 
 * @returns 
 */
const PostSortingFunction = (a,b) =>{
    return a.datz.compareWith(b)?-1:1;
}

const Nil = () => {}

export {
    PostSortingFunction,
    Nil
}