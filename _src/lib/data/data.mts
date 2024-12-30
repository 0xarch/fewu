import { Post } from "#lib/types";

class DataStorage {
    tags: string[] = [];
    categories: string[] = [];
    posts: Post[] = [];
}

export default DataStorage;