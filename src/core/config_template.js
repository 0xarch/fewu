const SettingsTemplate = {
    user: {
        name: "User Name",
        url: "User Url",
        avatar: "User Avatar",
        note: "User Note",
        location: "User Location"
    },
    user_data: {
        announcement: "No Announcement"
    },
    build: {
        post_directory: "posts",
        public_directory: "public",
        root: "/"
    },
    excluded_posts: ["about.md"],
    theme: {
        name: "Arch",
        options: {
            
        }
    },
    security: {
        
    },
    sitemap: {
        enabled: false,
        type: "XML",
        file_name: "sitemap.xml"
    },
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