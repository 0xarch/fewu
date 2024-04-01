import { mkdirSync, readFileSync } from "fs";
import { writeFile } from "fs/promises";
import { dirname, join as join_path } from "path";
import { errno, info } from "#core/run";
import { Collection, Correspond, BuildTemplate, Layout } from "#struct";
import parsers from "#core/build_compat";
import GObject from "#core/gobject";
import GString from "#core/gstring";
import db from "#db";

/**
 * d
 * @param {Collection} collection 
 * @param {Layout} file
 */
async function write(collection, file) {
    let public_directory = db.config.public_directory ?? db.config.build?.public_directory ?? 'public';
    let absolute_correspond = Correspond(
        join_path(db.theme.dirs.layout, file.correspond().from),
        join_path(public_directory, file.correspond().to, 'index.html'));

    // _______ get
    let build_template = new BuildTemplate(db.builder.parser_name,
        readFileSync(absolute_correspond.from).toString(),
        {
            basedir: db.theme.dirs.layout,
            filename: file.correspond().from
        }
    );
    const opt = file.option();
    const opt_split = file.getSplitOptions();
    const opt_foreach = file.getForeachOptions();

    // _______ define vars
    let iter = { "MAIN": {} };
    let addition = {};

    // _______ proc
    if (file.hasAddition()) {
        let map = file.addition();
        for (let key in map) {
            addition[key] = collection.get(map[key]);
        }
    }
    if (file.useForeachBuild()) {
        if (!opt_foreach) {
            errno(8102);
            return;
        }
        iter = {};
        let v_parent = collection.get(opt_foreach.parent);
        let time = 0;
        for (let key in v_parent) {
            let iter_key = 'V' + time;
            let each = {
                enabled: true,
                name: key,
                iter_key,
                value: v_parent[key]
            }
            iter[iter_key] = {
                ...iter[iter_key],
                // deprecated.
                varias: each,
                each
            };
            time++;
        }
    }

    for (const key in iter) {
        let addition_in_iter = iter[key];
        let path_write_to_prefix = public_directory;
        if (addition_in_iter.varias) {
            if(GString.test(file.correspond().to,1)){
                // The New (Experimental) GString format
                let collection = new Collection({
                    each: addition_in_iter.varias,
                });
                path_write_to_prefix += '/' + GString.parse(file.correspond().to,collection);
            } else {
                // The Old ${ } format.
                let varias = addition_in_iter.varias; varias; //used in eval
                path_write_to_prefix += '/' + eval('`' + file.correspond().to + '`');
            }
        } else {
            path_write_to_prefix = join_path(path_write_to_prefix, file.correspond().to);
        }
        if (file.useSplitBuild()) {
            if (!opt_split) {
                errno(8103);
                return;
            }
            let c_parent = collection.get(opt_split.parent) ?? GObject.getProperty(addition_in_iter,opt_split.parent) ?? GObject.getProperty(addition,opt_split.parent);
            let cycling_results = cycling(c_parent, opt_split.every, path_write_to_prefix);
            for (const result of cycling_results) {
                let stat = processTemplate(build_template, {
                    ...collection.asObject(),
                    ...addition,
                    ...addition_in_iter,
                    cycling: result,
                }, result.path);
                if (stat === 'Ok') info([result.path, 'YELLOW'], ['SUCCESS', "GREEN"]);
            }
        } else {
            let path = path_write_to_prefix + '/index.html';
            let stat = processTemplate(build_template, {
                ...collection.asObject(),
                ...addition,
                ...addition_in_iter,
            }, path);
            if (stat === 'Ok') info([path, 'YELLOW'], ['SUCCESS', "GREEN"]);
        }
    }
    return;
}

function cycling(parent, every, prefix = '') {
    if (!Array.isArray(parent)) {
        let _arr = [];
        for (let key in parent) {
            _arr.push({ key, value: parent[key] });
        }
        parent = _arr;
    }
    let len = parent.length;
    let results = [];
    for (let i = 0; i * every < len; ++i) {
        let Cycling = {
            enabled: true,
            total: Math.ceil(len / every),
            now: i + 1,
            value: parent.slice(i * every, (i + 1) * every),
            prev_path: join_path(prefix, (i) + '/index.html'),
            next_path: join_path(prefix, (i + 2) + '/index.html'),
            path: join_path(prefix, (i + 1) + '/index.html')
        };
        results.push(Cycling);
    }
    return results;
}

/**
 * 
 * @param { string } type 
 * @param { string } template 
 * @param { {
*  basedir: string,
*  filename: string
* } } options 
* @param { object } provide_variables
* @param { string } path_write_to 
* @returns {'Ok'}
*/
function proc_final(type, template, options, provide_variables, path_write_to) {
    type = db.builder.parser_name;
    let procer;
    switch (type) {
        case 'JADE':
            procer = parsers.pug;
            break;
        default:
            procer = parsers[type.toLowerCase()];
    }
    mkdirSync(dirname(path_write_to), { recursive: true });
    let result = procer(template, options, provide_variables);
    try {
        if (readFileSync(path_write_to).toString() === result) {
            info([path_write_to, 'MAGENTA'], ['SKIPPED: No difference', "GREEN"]);
            return 'Skipped';
        }
    } catch (e) { }
    writeFile(path_write_to, result, (e) => { if (e) throw e });
    return 'Ok';
}

/**
 * 
 * @param {BuildTemplate} template 
 * @param {object} provide_variables 
 * @param {string} path_write_to
 * @returns {'Ok'|'Skipped'} 
 */
function processTemplate(template,provide_variables,path_write_to){
    let procer;
    switch (template.type) {
        // Fix for Jade(Old name of pug)
        case 'JADE':
            procer = parsers.pug;
            break;
        default:
            procer = parsers[template.type.toLowerCase()];
    }
    mkdirSync(dirname(path_write_to), { recursive: true });
    let result = procer(template.text, template.getBase(), provide_variables);
    try {
        if (readFileSync(path_write_to).toString() === result) {
            info([path_write_to, 'MAGENTA'], ['SKIPPED: No difference', "GREEN"]);
            return 'Skipped';
        }
    } catch (e) { }
    writeFile(path_write_to, result, (e) => { if (e) throw e });
    return 'Ok';
}

export {
    write,
    proc_final,
    processTemplate as procFinal
}