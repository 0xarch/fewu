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
        enabled: [],
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

    },
    // sitemap (only post and homepage)
    sitemap: {
        enabled: false,
        type: "XML",
        name: "sitemap.xml" // deprecated, may use sitemap.xml for default
    },
    // rss feed
    rss: {
        enabled: false,
        title: "No Title",
        link: "/",
        description: "No Description"
    }
}

export {
    SettingsTemplate
}