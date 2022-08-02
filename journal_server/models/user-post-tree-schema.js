const mongoose = require("mongoose")
const {Schema} = mongoose

const user_post_node = new Schema({
    level:String,
    currentPath:String,
    nextPaths:[String],
})


const user_post_tree = new Schema({
    username:String,
    nodes:[user_post_node]
})


const UserPostTreeModel = mongoose.model("UserPostTrees", user_post_tree)
module.exports = {UserPostTreeModel}

