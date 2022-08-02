const mongoose = require("mongoose")

const {Schema} = mongoose

const user_schema = new Schema({
    username:String,
    password:String
})

const public_user_schema = new Schema({
    public_username:String,
    hash_match:String
})

const UserModel = mongoose.model("Users", user_schema)
const PublicUserModel = mongoose.model("PublicUsers",public_user_schema)
module.exports ={UserModel, PublicUserModel}



