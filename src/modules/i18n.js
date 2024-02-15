function i18n(json){
    if(!json)json={};
    return function(key){
        return json[key]||key;
    }
}

export default i18n;