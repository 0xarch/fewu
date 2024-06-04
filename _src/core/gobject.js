class GObject {

    static isObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }
    /**
     * 
     * @param {object} object 
     * @param {string|string[]} property_path 
     * @returns {any|undefined}
     */
    static getProperty(object, property_path) {
        let path = getPropertyPathFrom(property_path);
        let result = object;
        for (let i = 0; i < path.length; i++) {
            if (!result[path[i]]) {
                result = undefined;
                break;
            } else result = result[path[i]];
        }
        return result;
    }

    /**
     * 
     * @param {object} primary 
     * @param {object} secondary 
     * @param {boolean} insert_new_key 
     * @returns {object}
     */
    static mix(primary, secondary, insert_new_key = false) {
        let main = primary || {};
        for (let key in secondary) {
            let mainHasKey = main.hasOwnProperty(key);
            if (mainHasKey && GObject.isObject(primary[key]) && GObject.isObject(secondary[key]))
                primary[key] = GObject.mix(primary[key], secondary[key], insert_new_key);
            else if (mainHasKey || insert_new_key) {
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

    /**
     * @deprecated use TEXT.deleteEscapingCharacters
     * @param {string} str 
     * @returns {string}
     */
    static deleteEscapingChar(str) {
        return str.replace(/[\,\.\<\>\ \-\+\=\~\`\?\/\|\\\!\@\#\$\%\^\&\*\(\)\[\]\{\}\:\;"'～·「」；：‘’“”，。《》？！￥…、（）]+/g, '');
    }
}

function getPropertyPathFrom(property_path) {
    let path;
    if (!Array.isArray(property_path)) {
        property_path = property_path.replaceAll(/\\./g, '<!DOT!>');
        path = property_path.split(".").map(v => v.replaceAll(/<\!DOT\!>/g, '.'));
    } else {
        path = property_path;
    }
    return path;
}

// Mount on global
global.GObject = GObject;

export default GObject;