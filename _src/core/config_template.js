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

/**
 * @since 1.2.3
 */
const UserConfigurationTemplate = {
    protocolVersion: 2,
    // User settings
    user: {
        /*
        name and url are important, so we
        set fallback
        */
        name: "Coder",
        url: "example.com/user",
        data: {
            /*
            Data field,
            examples: note, location (V1 proto),
                logo, announcement, contact,
                friends, avatarUrl
            
            use user.data.some ?? FALLBACK_VALUE
            */
        }
    },
    // Language
    language: 'en-US',
    web: {
        publicPath: "example.com", // auto detect 
        repositoryCDN: '',
    },
    local: {
        postDirectory: "post",
        publicDirectory: "public",
        excludedFile: ['about.md']
    },
    default: {
        forewordText: "The author of this post has not yet set the foreword.\n\nCategory(ies): {{category}} \n\nTag(s): {{tags}}"
    },
    enabledFeatures: [
        /*
        some developer-only features for user.
        Available:

        */
    ],
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

    },
    /**
     * Default builder settings
     * @deprecated Fallback
     */
    build: {
        post_directory: "posts",
        public_directory: "public",
        root: "/",
        no_foreword_text: "The author of this article has not yet set the foreword.\n\nCategory(ies): {{category}} \n\nTag(s): {{tags}}"
    },
    /**
     * @deprecated Fallback
     */
    excluded_posts: ["about.md", "template.md"],
}

export {
    SettingsTemplate,
    UserConfigurationTemplate
}