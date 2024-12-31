import { Stats } from "node:fs";
import { Moment } from "moment";
import Context from "./fewu/context.mjs";
import { defaultConfigType } from "./fewu/config.mjs";

export declare interface Config extends defaultConfigType { };

export declare interface Page {
    id?: string;  // non-standard API
    title?: string;
    author?: string;
    language: string;
    date: Moment;
    updated: Moment;
    license: string;
    length: number;
    excerpt: string;
    more: string;
    properties: { [key: string]: string }; // non-standard API

    layout?: string;
    comments: boolean;
    content: string;

    prev?: Post;
    next?: Post;

    current: number;
    total: number;

    source: string;
    full_source: string;
    stat: Stats;  // non-standard API
}

export declare interface Post extends Page {
    tags: string[];
    categories: string[];
    properties: { [key: string]: string }; // non-standard API
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