module.exports = {

    init(app){

        app.get("/seo",(req,res)=>{
            res.json({
                title:"CMS SEO Plugin",
                keywords:["cms","seo","plugin"]
            });
        });

        console.log("SEO Plugin Loaded");

    }

};