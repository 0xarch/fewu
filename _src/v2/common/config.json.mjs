const value = () =>
    JSON.stringify({
        "general": {
            "url": 'blog.web.site',
            "lang": 'en-US',
            "post-directory": "posts",
            "public-directory": "public"
        },
        "user": {
            "name": 'John Doe',
            "url": 'this.example.org',
            "avatar": 'https://www.bing.com/favicon.ico',
            "data": {

            }
        },
        "theme": {
            "name": "Arch"
        },
        "enabled-features": [
            "generator/copy-next-image"
        ],
        "feature-options": {}

        ,
        "enabled-modules": [
            "sitemap"
        ],
        "module-options": {
            "sitemap": {
                "type": "xml",
                "name": "sitemap.xml"
            }
        }

        ,
        "default": {
            "introduction": "The author didn't write an introduction about this post."
        },
        "excluded-posts": [
            "about.md",
            "template.md"
        ]
    }, undefined, 4);

export {
    value
};