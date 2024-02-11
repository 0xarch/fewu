function i18n(json){
    return function(key){
        return json[key]||key;
    }
}

export default i18n;