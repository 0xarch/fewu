class Text {
    /**
     * 
     * @param {string} content 
     * @returns {number}
     */
    static wordCount(content){
        content = content.toString();
        let count = 0;
        let en_char = /[A-z]+/;
        content.replace(/[\u4E00-\u9FA5]/g, (e, i) => {
            count++;
            content = content.substring(0, i) + ' ' + content.substring(i + 1)
        });
        let arr = content.split(" ").filter(v => v != '');
        arr.forEach(v => en_char.test(v) && count++);
        return count;
    }

    /**
     * 
     * @param {string} content 
     * @param {string} replacer 
     * @returns {string}
     */
    static removeSymbols(content,replacer = ''){
        return content.replace(/[\,\.\<\>\ \-\+\=\~\`\?\/\|\\\!\@\#\$\%\^\&\*\(\)\[\]\{\}\:\;"'～·「」；：‘’“”，。《》？！￥…、（）]+/g, replacer);
    }
}

export default Text;