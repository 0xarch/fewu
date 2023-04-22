const STATIC = require("./static");

const PUBLIC_DIR = STATIC.PUBLIC_DIR;

STATIC.BUILD("index",{},`${PUBLIC_DIR}/index.html`);
STATIC.BUILD("archive",{},`${PUBLIC_DIR}/archive/index.html`);
STATIC.BUILD("category",{},`${PUBLIC_DIR}/category/index.html`);
STATIC.BUILD("about",{post:STATIC.ABOUT},`${PUBLIC_DIR}/about/index.html`);

STATIC.POSTS.forEach(item => {
    STATIC.BUILD("post",{post:item},`${PUBLIC_DIR}/${item.path}`);
});

STATIC.ENDING;