const express = require("express")
const getTokenData = require("../../utilities/getTokenData")
const private_entries_puts = express.Router()
const {UserPostTreeModel} = require("../../models/user-post-tree-schema")
private_entries_puts.put("/update-tree",async(req,res)=>{
    if (!req.logged){
        console.log("not logged")
        res.send({
            logout:true
        })
    }
    else{

        ({username,password}=getTokenData(req))
         
         const new_tree={
             username:username,
             nodes:req.body.tree
         }

        old_tree = await UserPostTreeModel.findOne({username})
        if(old_tree===null){
        const tree = new UserPostTreeModel(new_tree)

        const data=await tree.save()

        console.log(data)
        }

        else{
            update_result  = await UserPostTreeModel.updateOne({username},{nodes:req.body.tree})
            console.log(update_result)
        }

        res.send({
            status:"ok"
        })

    }
})

module.exports=private_entries_puts