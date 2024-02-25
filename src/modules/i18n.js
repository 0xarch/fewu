let langfile = {};

function set_i18n_file(json){
    langfile = json;
}

function i18n_new(json){
    if(!json)json={};
    return function(key){
        if(/[0-9]/.test(key)){
            let __tempor_val = [];
            for(let item of /[0-9]/g.exec(key)){
                key = key.replace(item,'{NUMBER}');
                __tempor_val.push(item);
            }
            let result= json[key]||key;
            for(let item of __tempor_val){
                result = result.replace('{NUMBER}',item);
            }
            return result;
        }
        else return json[key]||key;
    }
}

function i18n(key){
    if(/[0-9]/.test(key)){
        let __tempor_val = [];
        for(let item of /[0-9]/g.exec(key)){
            key = key.replace(item,'{NUMBER}');
            __tempor_val.push(item);
        }
        let result= langfile[key]||key;
        for(let item of __tempor_val){
            result = result.replace('{NUMBER}',item);
        }
        return result;
    }
    else return langfile[key]||key;
}

export default i18n;
export {
    i18n_new as i18n,
    set_i18n_file
}