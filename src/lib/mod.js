import { CTX } from "../modules/lib/hug.js";

/**
 * 
 * @param { number } num 
 */
function errno(num){
    console.log('Error ['+CTX(num,'RED','BOLD')+']');
}

/**
 * 
 * @param { Function } fn 
 * @param { number } err_num 
 */
function run(fn,err_num){
    try {
        fn();
    } catch(e){
        errno(err_num?err_num:'void');
    }
}

export {
    errno,
    run
}