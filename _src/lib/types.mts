import { Stats } from "node:fs";
import { Moment } from "moment";
import { defaultConfigType } from "./fewu/defaultConfig.mjs";

export declare interface Config extends defaultConfigType { };

export declare interface Post {
    id?: string | number;
    title?: string;
    author?: string;
    language: string;
    date: Moment;
    updated: Moment;
    tags: string[];
    categories: string[];
    license: string;
    length: number;
    properties: { [key: string]: string };

    layout?: string;
    comments: string;
    content: string;

    prev?: Post;
    next?: Post;

    current: number;
    total: number;

    source: string;
    stat: Stats;
}