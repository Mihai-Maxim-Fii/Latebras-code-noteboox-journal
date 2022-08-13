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

module.exports = private_entries_deletes
