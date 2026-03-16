const express = require("express");
const loadPlugins = require("./pluginLoader");

const app = express();

app.use(express.json());

// load plugins
loadPlugins(app);

app.get("/", (req,res)=>{
    res.send("CMS Core System");
});

app.listen(5000, ()=>{
    console.log("CMS running on port 5000");
});