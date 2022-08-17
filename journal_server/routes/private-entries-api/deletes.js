const express = require("express")
const getTokenData = require("../../utilities/getTokenData")
const {PrivatePostsModel} = require("../../models/private-posts-schemas")
const private_entries_deletes = express.Router()

private_entries_deletes.delete("/delete-post", async (req, res) => {
    if (!req.logged) {
        res.send({logout: true})
    } else {
        ({username, password} = getTokenData(req))
        
        let all_user_posts = await PrivatePostsModel.find({username})
        let my_obj = (all_user_posts.filter(p => JSON.stringify(p._id.getTimestamp()).replace(`"`, "").replace(`"`, "") === req.query.key))[0]
        let update = await PrivatePostsModel.deleteOne({_id: my_obj._id})
        res.send(update)
    }
})




private_entries_deletes.delete("/delete-folders", async (req, res) =>{
    if (!req.logged) {
        res.send({logout: true})
    } else {
        ({username, password} = getTokenData(req))

        let paths_of_folders_to_delete = Object.values(req.query)

        let all_user_posts = await PrivatePostsModel.find({username})

        let my_objs = (all_user_posts.filter(p => p.path.some(path=>paths_of_folders_to_delete.includes(path))))
    
        let my_obj_ids= my_objs.map(obj=>obj._id)

        let delete_obj = await PrivatePostsModel.deleteMany({
            _id:{$in:my_obj_ids }
        })
        

        res.send(delete_obj)

        
    }
})

module.exports = private_entries_deletes
