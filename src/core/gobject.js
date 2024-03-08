class GObject {

    /**
     * 
     * @param {object} object 
     * @param {string|string[]} property_path 
     * @returns {any|null}
     */
    static getProperty(object,property_path) {
        let path = getPropertyPathFrom(property_path);
        let __tempor_val = object;
        for (let i = 0; i < path.length; i++) {
            if (!__tempor_val[path[i]]) {
                __tempor_val = null;
                break;
            } else __tempor_val = __tempor_val[path[i]];
        }
        return __tempor_val;
    }

    /**
     * 
     * @param {object} primary 
     * @param {object} secondary 
     * @param {boolean} insert_new_key 
     * @returns {object}
     */
    static mix(primary, secondary, insert_new_key = false) {
        let main = primary||{};
        for (let key in secondary) {
            if (main.hasOwnProperty(key) || insert_new_key) {
                main[key] = secondary[key];
            }
        }
        return main;
    }

    /**
     * 
     * @param {object} object 
     * @param {string|string[]} property_path 
     * @returns {boolean}
     */
    static hasProperty(object, property_path) {
        let path = getPropertyPathFrom(property_path);
        let __tempor_val = object;
        let result = true;
        for (let i = 0; i < path.length; i++) {
            if (!__tempor_val[path[i]]) {
                result = false;
                break;
            } else __tempor_val = __tempor_val[path[i]];
        }
        return result;
    }

    static deleteEscapingChar(str){
        return str.replace(/[\,\.\<\>\ \-\+\=\~\`\?\/\|\\\!\@\#\$\%\^\&\*\(\)\[\]\{\}\:\;"'～·「」；：‘’“”，。《》？！￥…、（）]+/g,'');
    }
}

function getPropertyPathFrom(property_path){
    let path;
    if(!Array.isArray(property_path)){
        property_path = property_path.replaceAll(/\\./g,'<!DOT!>');
        path = property_path.split(".").map(v=>v.replaceAll(/<\!DOT\!>/g,'.'));
    } else {
        path = property_path;
    }
    return path;
}

export default GObject;