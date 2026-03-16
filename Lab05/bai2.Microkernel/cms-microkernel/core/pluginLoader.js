const fs = require("fs");
const path = require("path");

function loadPlugins(app){

    const pluginPath = path.join(__dirname,"../plugins");

    const files = fs.readdirSync(pluginPath);

    files.forEach(file => {

        const plugin = require(`../plugins/${file}`);

        if(plugin.init){
            plugin.init(app);
        }

    });

}

module.exports = loadPlugins;