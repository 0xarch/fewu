function i18n(json){
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

export default i18n;