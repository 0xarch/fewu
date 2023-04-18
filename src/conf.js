const fs = require("fs");
const CONF_DIR = "./conf/conf.json";
const CONF = JSON.parse(fs.readFileSync(CONF_DIR));
exports.CONF=CONF;