const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/cms";

// connect mongodb
mongoose.connect(mongoUrl)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));

// schema
const PostSchema = new mongoose.Schema({
    title:String,
    content:String
});

const Post = mongoose.model("Post",PostSchema);

// GET posts
app.get("/api/posts", async(req,res)=>{
    const posts = await Post.find();
    res.json(posts);
});

// ADD post
app.post("/api/posts", async(req,res)=>{
    const post = new Post(req.body);
    await post.save();
    res.json(post);
});

// server start
app.listen(5000,()=>{
    console.log("Server running on port 5000");
});