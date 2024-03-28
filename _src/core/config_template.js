const SettingsTemplate = {
    // User settings
    user: {
        name: "User Name",
        url: "User Url",
        avatar: "User Avatar",
        note: "User Note",
        location: "User Location",
        data: {
            /*
             Data field, e.g. announcement 
            */
        }
    },
    // Language
    language: 'en-US',
    // Default builder settings
    build: {
        post_directory: "posts",
        public_directory: "public",
        root: "/",
        no_foreword_text: "The author of this article has not yet set the foreword.\n\nCategory(ies): {{category}} \n\nTag(s): {{tags}}"
    },
    // post.excluded
    excluded_posts: ["about.md", "template.md"],
    // Module settings
    modules: {
        enabled: ['sitemap','rss'],
        sitemap: {
            type: "XML",
            name: "sitemap.xml"
        },
        rss: {
            title: "No title",
            link: "/",
            description: "No Description"
        }
    },
    // Theme settings
    theme: {
        name: "Arch",
        options: {

        }
    },
    // Security settings (needs implement)
    security: {

    }
}

export {
    SettingsTemplate
}