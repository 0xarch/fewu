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
        root: "/"
    },
    // post.excluded
    excluded_posts: ["about.md","template.md"],
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
        file_name: "sitemap.xml"
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