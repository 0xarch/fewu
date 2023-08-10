/**
 *
 * @param { element } element
 */
function render(element){
    let stack = Em3et_AST(element.textContent);
    let parsed_text = Em3et_Compile(stack);
    console.log(stack,parsed_text);
}

/**
 *
 * @param { string } raw_string
 * @returns { Array }
 */
function Em3et_AST(raw_string){
    let stack = new Array;
    let raw_chars = raw_string.split("");
    let i = 0,len = raw_chars.length;
    while(i<len){
        let _char_now = raw_chars[i];
        if(/[A-Za-z]/.test(_char_now)){
            let _str = _char_now;
            i++;
            while(i<len){
                let __char_now = raw_chars[i];
                if(/[A-Za-z ]/.test(__char_now)){
                    _str = _str+__char_now;
                    i++;
                }else{
                    stack.push(_str);
                    i--;
                    break;
                }
            }
        }else
        if(_char_now=='('){
            stack.push('(');
            let _str = new String;
            i++;
            while(i<len){
                let __char_now = raw_chars[i];
                if(__char_now!=')'){
                    _str = _str+__char_now;
                    i++;
                }else{
                    stack.push(_str);
                    break;
                }
            }
        }else
        if(_char_now==':'){
            stack.push(':');
            let _str = new String;
            i++;
            while(i<len){
                let __char_now = raw_chars[i];
                if(__char_now!=':'){
                    if(__char_now!='\\'){
                        _str = _str+__char_now;
                    }else{
                        i++;
                        _str = _str+raw_chars[i];
                    }
                    i++;
                }else{
                    stack.push(_str);
                    break;
                }
            }
        }else
        if(!/[ \n]/.test(_char_now)) stack.push(_char_now);
        i++;
    }
    return stack;
}

/**
 *
 * @param { Array } stack
 * @returns { String }
 */
function Em3et_Compile(stack){
    let result = new String;
    let i=0,len = stack.length;
    let element_stack = new Array;
    while(i<len){
        let text = stack[i];
        if(/[A-Za-z]+/.test(text)){
            result = result+'<'+text;
            element_stack.push(text);
        }else{
            switch(text){
                case '{':
                    result = result+'>';
                    break;
                case '}':
                    result = `${result}</${element_stack.pop()}>`;
                    break;
                case ':':
                    i++;
                    result = result+stack[i];
                    break;
                case '(':
                    i++;
                    result = result+' '+stack[i];
                    break;
                case '#':
                    i++;
                    result = `${result} id="${stack[i]}"`;
                    break;
                case '.':
                    i++;
                    result = `${result} class="${stack[i]}"`;
                    break;
            }
        }
        i++;
    }
    return result;
}
exports.render=(element)=>render(element);
