class I18n {
    #map = {};

    constructor({
        profile={}
    }={}){
        this.#map = profile;
    }

    setProfile(profile){
        this.#map = profile;
    }

    translate(key){
        let result = '';
        if (/[0-9]/.test(key)) {
            let replaceList = [];
            for (let item of (/[0-9]+/g).exec(key)) {
                key = key.replace(item, '{NUMBER}');
                replaceList.push(item);
            }
            result = this.#map[key] ?? key;
            for (let item of replaceList) {
                result = result.replace('{NUMBER}', item);
            }
        }
        else {
            result = this.#map[key] ?? key;
        }
        return result;
    }
}

export default I18n;