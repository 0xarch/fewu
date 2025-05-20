export default class GObject {

    static isObject(obj: object) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }

    static getProperty(object: object, property_path: string | string[]): any | undefined {
        let path = getPropertyPathFrom(property_path);
        let result: any = object;
        for (let i = 0; i < path.length; i++) {
            if (!result[path[i]]) {
                result = undefined;
                break;
            } else result = result[path[i]];
        }
        return result;
    }

    static mix(
        primary: { [key: string]: any },
        secondary: { [key: string]: any }
    ): object {
        let main: any = primary || {};
        for (let key in secondary) {
            if (Object.prototype.hasOwnProperty.call(secondary, key)) {
                main[key] = secondary[key];
            }
        }
        return main;
    }

    static hasProperty(object: object, property_path: string | string[]): boolean {
        let path = getPropertyPathFrom(property_path);
        let __tempor_val: any = object;
        let result = true;
        for (let i = 0; i < path.length; i++) {
            if (!__tempor_val[path[i]]) {
                result = false;
                break;
            } else __tempor_val = __tempor_val[path[i]];
        }
        return result;
    }

}

function getPropertyPathFrom(property_path: string | string[]) {
    let path: string[] = [];
    if (!Array.isArray(property_path)) {
        property_path = property_path.replaceAll(/\\./g, '<!DOT!>');
        path = property_path.split(".").map(v => v.replaceAll(/<\!DOT\!>/g, '.'));
    } else {
        path = property_path;
    }
    return path;
}