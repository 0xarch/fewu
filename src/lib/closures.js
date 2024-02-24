/**
 * 
 * @param {Post} a 
 * @param {Post} b 
 * @returns compare
 */
const PostSortingFunction = (a,b) =>{
    return a.datz.compareWith(b)?-1:1;
}

const Nil = () => {}

const notFake = (v) => v!=''

export {
    PostSortingFunction,
    Nil,
    notFake
}