const express = require("express")
const getTokenData = require("../../utilities/getTokenData")
const private_entries_posts = express.Router()
const {PrivatePostsModel} = require("../../models/private-posts-schemas")

private_entries_posts.post("/postentry",async (req,res)=>{
    if (!req.logged){
        res.send({
            logout:true
        })
    }
    else{

        ({username,password}=getTokenData(req))
        let post_data = {
            username,
            title:req.body.title,
            language:req.body.language,
            font_size:req.body.font_size,
            content:req.body.content,
            images:req.body.images,
            path:req.body.path
        }

        const newPost = new PrivatePostsModel(post_data)

        const data=await newPost.save()


        res.send({
            status:"ok",
            msg:"Post added succcessfully!"
        })
    }
})

module.exports = private_entries_posts

