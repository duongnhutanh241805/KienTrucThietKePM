module.exports = {

    init(app){

        app.get("/analytics",(req,res)=>{
            res.json({
                visitors:1200
            });
        });

    }

};