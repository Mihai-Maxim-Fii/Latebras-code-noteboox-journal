const Joi = require("joi")
const sha256 = require("crypto-js/sha256")
const express = require("express");
const jwt = require("jsonwebtoken")
const user_posts = express.Router()
let refresh_tkns = require("../../models/refresh_tokens")
const {UserModel, PublicUserModel} = require("../../models/user-schemas")
const {UserPostTreeModel} = require("../../models/user-post-tree-schema")
const register_schema = Joi.object({username: Joi.string().min(6).max(20), public_username: Joi.string().min(6).max(20), password: Joi.string().min(10).max(25)})

const salt = process.env.HASH_SALT

const public_user_salt = process.env.PUBLIC_USER_HASH_SALT







user_posts.post("/register", async (req, res) => {


    if(req.logged){
        res.send({
            status:"nok",
            msg:"already logged in"
        })
    }
    else{


    const is_user_valid = register_schema.validate(req.body)

    if (is_user_valid.error === undefined) {

        const hashed_user = {
            username: sha256(req.body.username + salt).toString(),
            password: sha256(req.body.password + salt).toString()
        }


        const hashed_public_user = {
            public_username: req.body.public_username,
            hash_match: sha256(hashed_user.username + public_user_salt).toString()
        }

        user_already_exists = await UserModel.findOne({username: hashed_user.username})
        public_user_already_exists = await PublicUserModel.findOne({public_username: hashed_public_user.public_username})

        if (user_already_exists !== null) {
            res.send({status: "nok", msg: "Username is already taken!"})
        } else if (public_user_already_exists !== null) {
            res.send({status: "nok", msg: "Public Username is already taken!"})
        } else {


            const newUser = new UserModel(hashed_user)

            const newPublicUser = new PublicUserModel(hashed_public_user)
            await(newUser.save())
            await(newPublicUser.save())

            const empty_tree = {
                username:hashed_user.username,
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

            res.send({status: "ok", msg: "Account created!"})
        }
    } else {
        res.send({status: "nok", msg: is_user_valid.error})
    }


}}


)



user_posts.post("/login", async (req, res) => {
    if(req.logged){
        res.send({
            status:"nok",
            msg:"already logged in"
        })
    }
    else{


    const hashed_user = {
        username: sha256(req.body.username + salt).toString(),
        password: sha256(req.body.password + salt).toString()
    }

    user = await UserModel.findOne(hashed_user)


    if (user !== null) {
      
        const refresh_token = jwt.sign(hashed_user, process.env.JWT_REFRESH_TOKEN, {expiresIn: '24h'})
        const access_token = jwt.sign(hashed_user, process.env.JWT_TOKEN, {expiresIn: '10s'})
        refresh_tkns.add_refresh_token(refresh_token)

        res.cookie("access_token",access_token,{httpOnly:true, maxAge: 3600000})
        res.cookie("refresh_token",refresh_token,{httpOnly:true, maxAge: 3600000})

        res.send({status: "ok", msg: "Login successfull!"})
    } else {
        res.send({status: "nok", msg: "Username or Password is invalid!"})
    }
}

})

module.exports = user_posts
