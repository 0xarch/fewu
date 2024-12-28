import { Stats } from "node:fs";
import { Moment } from "moment";
import Context from "./fewu/context.mjs";
import { defaultConfigType } from "./fewu/config.mjs";

export declare interface Config extends defaultConfigType { };

export declare interface Post {
    id?: string;  // non-standard API
    title?: string;
    author?: string;
    language: string;
    date: Moment;
    updated: Moment;
    tags: string[];
    categories: string[];
    license: string;
    length: number;
    properties: { [key: string]: string }; // non-standard API

    layout?: string;
    comments: string;
    content: string;

    prev?: Post;
    next?: Post;

    current: number;
    total: number;

    source: string;
    stat: Stats;  // non-standard API
};

export declare interface Scaffold {
    content: string;
};

export declare type ResultStatus = 'Ok' | 'Err';

export declare interface Result<T> {
    status: ResultStatus,
    value?: T
}

export {
    Context
};