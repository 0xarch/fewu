import { PageContainer, Post } from "#lib/types";

class DataStorage {
    tags: PageContainer[] = [];
    categories: PageContainer[] = [];
    posts: Post[] = [];
    // Experimental
    sources: Record<string, Post> = {};
}

export default DataStorage;