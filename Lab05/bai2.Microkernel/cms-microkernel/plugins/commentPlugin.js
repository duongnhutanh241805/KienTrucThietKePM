module.exports = {

    init(app){

        app.get("/comments",(req,res)=>{
            res.json([
                {user:"A",comment:"Good post"},
                {user:"B",comment:"Nice CMS"}
            ]);
        });

        console.log("Comment Plugin Loaded");

    }

};