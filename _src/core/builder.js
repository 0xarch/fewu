import database from "#database";

import TemplateString from "#util/TemplateString";

import { mkdir, readFile, writeFile } from "fs/promises";

import { dirname, join as join_path } from "path";
import { Correspond, BuildTemplate, Layout } from "#struct";
import parsers from "#core/build_compat";
import GObject from "#core/gobject";
import db from "#db";

/**
 * 
 * @param {import("#class/collection").default} collection 
 * @param {Layout} file
 */
async function write(collection, file) {
    let public_directory = database.data.directory.publicDirectory;
    let absolute_correspond = Correspond(
        join_path(db.theme.dirs.layout, file.correspond().from),
        join_path(public_directory, file.correspond().to, 'index.html'));

    // _______ get
    let templateContent = (await readFile(absolute_correspond.from)).toString();
    let build_template = new BuildTemplate(db.builder.parser_name,
        templateContent,
        {
            basedir: db.theme.dirs.layout,
            filename: file.correspond().from
        }
    );
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
            console.error(`[Builder] ${file.name} declares foreach-build using but not configured!`);
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
            if (TemplateString.test(file.correspond().to, 1)) {
                // The New TemplateString format
                path_write_to_prefix += '/' + TemplateString.parse(file.correspond().to,{
                    each: addition_in_iter.each
                });
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
                console.error(`[Builder] ${file.name} declares split-build using but not configured!`);
                return;
            }
            let c_parent = collection.get(opt_split.parent) ?? GObject.getProperty(addition_in_iter, opt_split.parent) ?? GObject.getProperty(addition, opt_split.parent);
            let cycling_results = cycling(c_parent, opt_split.every, path_write_to_prefix);
            for (const result of cycling_results) {
                await processTemplate(build_template, {
                    ...collection.asObject(),
                    ...addition,
                    ...addition_in_iter,
                    cycling: result,
                    split: result
                }, result.path);
            }
        } else {
            let path = path_write_to_prefix + '/index.html';
            await processTemplate(build_template, {
                ...collection.asObject(),
                ...addition,
                ...addition_in_iter,
            }, path);
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
 * @param {BuildTemplate} template 
 * @param {object} provide_variables 
 * @param {string} path_write_to
 */
async function processTemplate(template, provide_variables, path_write_to) {
    let procer = parsers[template.type.toLowerCase()];
    await mkdir(dirname(path_write_to),{recursive: true});
    let result = procer(template.text, template.getBase(), provide_variables);
    try {
        let testContent = (await readFile(path_write_to)).toString();
        if(testContent === result){
            console.info(`[Builder] Skipped write operation of ${path_write_to}`);
            return;
        }
    } catch (e) { }
    writeFile(path_write_to, result, (e) => {
        if (e) {
            console.error(`[Builder] Build failed: In writing to ${path_write_to}. Message: ${e.message}`);
        } else {
            console.log(`[Builder] Build success: ${path_write_to}`);
        }
    });
}

export {
    write,
    processTemplate as procFinal,
    processTemplate
}
