const mongoose = require("mongoose")
const {Schema} = mongoose

const image_schema = new Schema({
    image_name:String,
    image_data:String
}) 
const private_post_schema = new Schema({
    username:String,
    title:String,
    language:String,
    font_size:String,
    content:String,
    images:[image_schema],
    path:[String]
})

const PrivatePostsModel = mongoose.model("PrivatePosts", private_post_schema)
module.exports ={PrivatePostsModel}