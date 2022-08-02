const express = require("express")
const getTokenData = require("../../utilities/getTokenData")
const private_entries_gets = express.Router()
const {PrivatePostsModel} = require("../../models/private-posts-schemas")
const {UserPostTreeModel} = require("../../models/user-post-tree-schema")
private_entries_gets.get("/user-tree", async (req, res)=>{
    if (!req.logged){
        res.send({
            logout:true
        })
    }
    else{
        ({username,password}=getTokenData(req))
        
        tree = await UserPostTreeModel.findOne({username})
        if(tree!==null)
        res.send({
            status:"ok",
            tree
        })
        else{

            const empty_tree = {
                username:username,
                nodes:[
                    {
                        level:0,
                        currentPath:"L0#root",
                        nextPaths:[]
                    }
                ]
            }
            const newTree=new UserPostTreeModel(empty_tree)

            await newTree.save()

            res.send(
            {status:"ok",
            tree:empty_tree})
        }
    }

})
private_entries_gets.get("/allposts",async (req,res)=>{
    if (!req.logged){
        res.send({
            logout:true
        })
    }
    else{
        let path_tokens=Object.values(req.query)

        console.log(path_tokens);


        ({username,password}=getTokenData(req))
        

         allPosts = await PrivatePostsModel.find({
            username,
            path:path_tokens
        })
        posts_to_send=[]
        allPosts.forEach(p => {
            post = {
                date:p._id.getTimestamp(),
                title:p.title,
                language:p.language,
                font_size:p.font_size,
                content:p.content,
                images:p.images
            }
            posts_to_send.push(post)
        });

        posts_to_send.reverse()
        console.log(posts_to_send)


        res.send({
            status:"ok",
            msg:"Here are your posts!",
            data:posts_to_send
        })
    }

})

module.exports = private_entries_gets
