class GString {
    static #get_array(str) {
        let is_locating_start = false, is_locating_end = false;
        let strs = [''], i = 0, is_in_val = false, skip_a_char = false;
        str.split("").filter(v => v != '').forEach((char) => {
            if (!skip_a_char) {
                if (char == '\\') {
                    skip_a_char = true;
                } else if (char === '{') {
                    if (is_locating_start) {
                        is_in_val = !is_in_val;
                        i++;
                        strs[i] = '';
                        is_locating_start = false;
                    } else if (!is_in_val) {
                        is_locating_start = true;
                    } else {
                        strs[i] += char;
                    }
                } else if (char === '}') {
                    if (is_locating_end) {
                        is_in_val = !is_in_val;
                        i++;
                        strs[i] = '';
                        is_locating_end = false;
                    } else if (is_in_val) {
                        is_locating_end = true;
                    } else {
                        strs[i] += char;
                    }
                } else {
                    if (is_locating_start) {
                        strs[i] += '{';
                        is_locating_start = false;
                    } else if (is_locating_end) {
                        strs[i] += '}';
                        is_locating_end = false;
                    }
                    strs[i] += char;
                }
            } else {
                strs[i] += char;
                skip_a_char = false
            }
        });
        return strs;
    }

    /**
     * 
     * @param {string} str 
     * @param {number} valid_count_least
     * @param {number} valid_count_most
     * @returns {boolean}
     */
    static test(str, valid_count_least, valid_count_most) {
        let matches_start_count = 0;
        let matches_end_count = 0;
        let is_locating_start = false, is_locating_end = false;
        let is_in_val = false, skip_a_char = false;
        str.split("").filter(v => v != '').forEach((char) => {
            if (!skip_a_char) {
                switch (char) {
                    case '\\':
                        skip_a_char = true;
                        break;
                    case '{':
                        if (is_locating_start) {
                            is_in_val = !is_in_val;
                            is_locating_start = false;
                            matches_start_count += 1;
                        } else if (!is_in_val) {
                            is_locating_start = true;
                        }
                        break;
                    case '}':
                        if (is_locating_end) {
                            is_in_val = !is_in_val;
                            is_locating_end = false;
                            matches_end_count += 1;
                        } else if (is_in_val) {
                            is_locating_end = true;
                        }
                }
            } else {
                skip_a_char = false
            }
        });
        if (matches_start_count != matches_end_count) return false;
        if (valid_count_least && matches_start_count < valid_count_least) return false;
        if (valid_count_most && matches_start_count > valid_count_most) return false;
        return true;
    }

    /**
     * 
     * @param {Array} arr 
     * @param {Collection} coll 
     * @returns {string}
     */
    static #eval(arr, coll) {
        if (!coll) return this.toString();
        let is_in_val = false, result = '';
        arr.forEach((v) => {
            if (is_in_val) result += coll.get(v);
            else result += v;
            is_in_val = !is_in_val;
        });
        return result;
    }

    /**
     * 
     * @param {string} str 
     * @returns {GString}
     */
    static from(str) {
        let strs = GString.#get_array(str);
        return new GString(strs);
    }

    /**
     * Quick use of GString.from(str).eval(collection)
     * @param {string} str 
     * @param {Collection} collection
     * @returns {string}
     */
    static parse(str, collection) {
        return GString.#eval(GString.#get_array(str), collection);
    }

    #str_group;
    constructor(strg) {
        if (Array.isArray(strg)) {
            this.#str_group = strg;
        } else throw new Error('SymString constructor : Argument is not any[]');
    }
    /**
     * 
     * @param {Collection} collection 
     */
    eval(collection) {
        return GString.#eval(collection);
    }
    toString() {
        return this.#str_group.join('');
    }
}

export default GString