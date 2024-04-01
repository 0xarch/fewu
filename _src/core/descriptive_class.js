class BuiltinDescriptivePostContainer {
    #sort_name
    included = []
    constructor(name, v) {
        this.#sort_name = name
        this.included.push(...v)
    }
    name = () => this.#sort_name
    includes = (id) => this.included.includes(id)
    add = (id) => !this.includes(id) && this.included.unshift(id);
}

class Tag extends BuiltinDescriptivePostContainer {
    tagname;
    constructor(name, v) {
        super(name, v);
        this.tagname = name;
    }
}

class Category extends BuiltinDescriptivePostContainer {
    catename;
    constructor(name, v) {
        super(name, v);
        this.catename = name;
    }
}

export {
    Tag,
    Category,
}