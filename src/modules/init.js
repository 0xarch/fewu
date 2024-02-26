/**
 * 
 * @returns {string}
 * @since v2.1
 */
function get_default_configuration(){
    return `{
        "user": {
            "name": "User Name",
            "url": "User Url",
            "avatar": "User Image Url",
            "note": "User note (description)",
            "location": "User Location (Optional)",
            "data":{
                "announcement": "Annoucement (Optional)"
            }
        },
        "site_url": "Website Url",
        "sitemap":{
            "type": "xml",
            "name": "sitemap.xml"
        },
        "language": "en-US",
        "theme":{
            "name":"Arch",
            "options":{
                "3rd_bar":false
            },
            "title":{
                "separator": "|",
                "index": "Hello Arch!"
            }
        },
        "RSSFeed":{
            "title": "",
            "link": "",
            "description":""
        },
        "extra_files":{
            "from(in extra directory)": "to(in public directory)"
        },
        "excluded_posts": ["about.md"],
        "override": [],
        "widgets": {
            "only used in": "theme"
        },
        "build": {
            "post_directory": "posts",
            "public_directory": "public",
            "site_root": "/",
            "alwaysnew": true
        }
    }`
}