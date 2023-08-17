const fs = require("fs");
const path = require("path");

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
function Em3et_AST(raw_string,file_dir){
    let p_string = raw_string;
    let matches = raw_string.matchAll(/\*([^*]+?)\*/g);
    let quo = false;
    for(let item of matches){
        p_string = p_string.replace(item[0],Em3et_FindFile(file_dir,item[1]));
    }
    console.log(p_string);
    let stack = [];
    let raw_chars = p_string.split("");
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
        if(['(',':','%','*','"',"'"].includes(_char_now)){
            if(!['"',"'"].includes(_char_now)) stack.push(_char_now);
            let _str = "";
            let _end_char = _char_now!='('?_char_now:')';
            i++;
            while(i<len){
                let __char_now = raw_chars[i];
                if(__char_now!=_end_char){
                    if(__char_now!='\\'){
                        _str += __char_now;
                    }else{
                        _str += raw_chars[++i];
                    }
                    i++;
                }else{
                    stack.push(_str);
                    break;
                }
            }
        }else
        if(_char_now==','){
            if(quo){
                stack.push('}');
                quo=false;
            }else{
                stack.push('{');
                quo=true;
            }
        }else
        if(!/[ \n]/.test(_char_now)) stack.push(_char_now);
        i++;
    }
    return stack
}

/**
 *
 * @param { Array } stack
 * @param { JSON } argument
 * @returns { String }
 */
function Em3et_Compile(stack,argument){
    let result = '';
    let i=0,len = stack.length;
    let element_stack = [];
    result = 'let str = new String; str+=`';
    let in_command = false, in_variable = false;
    while(i<len){
        let text = stack[i];
        if(/[A-Za-z]+/.test(text)){
            result += '<'+text;
            element_stack.push(text);
        }else{
            switch(text){
                case '{':
                case '[':
                    result +='>';
                    break;
                case '}':
                case ']':
                    result += `</${element_stack.pop()}>`;
                    break;
                case '!':
                case '/':
                    element_stack.pop();
                    result += '/>';
                    break;
                case ':':
                    result += stack[++i];
                    break;
                case '(':
                    result += ' '+stack[++i];
                    break;
                case '#':
                    result += ` id="${stack[++i]}"`;
                    break;
                case '.':
                    result += ` class="${stack[++i]}"`;
                    break;
                case '%':
                    if(in_command){
                        result += '`'+stack[++i]+';str+=`';
                        in_command = false;
                    }else{
                        result += '`;'+stack[++i]+'str+=`';
                        in_command = true;
                    }
                    break;
                case '$':
                    if(in_variable){
                        result += '}';
                        in_variable=false;
                    }else{
                        result += '${'+stack[++i];
                        in_variable=true;
                    }
                    break;
            }
        }
        i++;
    }
    result += '`;str';
    if(argument)
        with(argument) return eval(result)
    else return eval(result)
}

function Em3et_FileRide(dir,name){
    for(let item of fs.readdirSync(dir,{recursive:true})){
        if(item == name){
            return fs.readFileSync(path.join(dir,item)).toString()
        }
    }
    return null
}

function Em3et_FindFile(dir,name){
    let result = null;
    if(typeof dir == 'string'){
        result = Em3et_FileRide(dir,name);
    }else if(typeof dir == 'object'){
        for(let item of dir){
            let v = Em3et_FileRide(item,name);
            if(v!=null){
                result = v;
                break;
            }
        }
    }
    return result
}
exports.render=(element,arg)=>render(element,arg);
exports.renderText=(text,file_dir,arg)=>Em3et_Compile(Em3et_AST(text,file_dir),arg);
exports.findFile=(dir,name)=>Em3et_FindFile(dir,name);