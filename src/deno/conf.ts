const Config = JSON.parse(await Deno.readTextFile("./conf/conf.json"));
export default Config;
