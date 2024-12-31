import { PageContainer, Post } from "#lib/types";

class DataStorage {
    tags: PageContainer[] = [];
    categories: PageContainer[] = [];
    posts: Post[] = [];
}

export default DataStorage;