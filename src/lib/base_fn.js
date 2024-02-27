function has_property(object, property_path) {
    let path = property_path.split(".");
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
 * 
 * @param {object} object 
 * @param {string} property_path
 * @returns 
 */
function get_property(object,property_path) {
    property_path = property_path.replaceAll(/\\./g,'<!DOT!>');
    let path = property_path.split(".");
    path = path.map(v=>v.replaceAll(/<\!DOT\!>/g,'.'));
    let __tempor_val = object;
    for (let i = 0; i < path.length; i++) {
        if (!__tempor_val[path[i]]) {
            __tempor_val = null;
            break;
        } else __tempor_val = __tempor_val[path[i]];
    }
    return __tempor_val;
}

function mix_object(primary, secondary, insert_new_key = false) {
    let main = primary||{};
    for (let key in secondary) {
        if (main.hasOwnProperty(key) || insert_new_key) {
            main[key] = secondary[key];
        }
    }
    return main;
}

export {
    has_property,
    get_property,
    mix_object
}