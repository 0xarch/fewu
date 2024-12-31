class Text {
    static wordCount(content: string): number{
        content = content.toString();
        let count = 0;
        let en_char = /[A-z]+/;
        content.replace(/[\u4E00-\u9FA5]/g, (e: string, i: number) => {
            count++;
            content = content.substring(0, i) + ' ' + content.substring(i + 1);
            return e;
        });
        let arr = content.split(" ").filter(v => v != '');
        arr.forEach(v => en_char.test(v) && count++);
        return count;
    }

    static removeSymbols(content: string,replacer: string = ''): string{
        return content.replace(/[\,\.\<\>\ \-\+\=\~\`\?\/\|\\\!\@\#\$\%\^\&\*\(\)\[\]\{\}\:\;"'～·「」；：‘’“”，。《》？！￥…、（）]+/g, replacer);
    }
}

export default Text;