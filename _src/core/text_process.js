// ***************************************
// * Nexo Text Process Module.           *
// *                                     *
// *   Copyright 2024 0xarch             *
// *   Please don't change               *
// *                                     *
// *   @Pure                             *
// *   @Simple                           *
// ***************************************

/**
 * 
 * @param {string} content 
 */
function word_count(content) {
    let count = 0;
    let en_char = /[A-z]+/;
    content.replace(/[\u4E00-\u9FA5]/g, (e, i) => { count++; content = content.substring(0, i) + ' ' + content.substring(i + 1) });
    let arr = content.split(" ").filter(v => v != '');
    arr.forEach(v => en_char.test(v) && count++);
    return count;
}

export {
    word_count
}