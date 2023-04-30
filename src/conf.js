const read = require("fs").readFileSync;
const CONF_DIR = "./conf/conf.json";
const CONF = JSON.parse(read(CONF_DIR,(err)=>{
    if(err){
        LOG("<Failed> Met an error while reading configuration file!");
    }
}));
exports.CONF=CONF;