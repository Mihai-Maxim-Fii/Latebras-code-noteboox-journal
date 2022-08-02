const express = require("express")
const user_gets = express.Router()
let user_refresh_tokens = require("../../models/refresh_tokens")

user_gets.get("/logstatus",(req,res)=>{
    if (req.logged){
        res.send({
            status:"ok",
            msg:"logged in!"
        })
    }
    else{
        res.send({
            status:"nok",
            msg:"not logged in!"
        })
    }
})



user_gets.get("/logout",(req,res)=>{
    if (req.logged){
        user_refresh_tokens=user_refresh_tokens.filter(token=>token!==req.cookies["refresh_token"])
        res.cookie("access_token","",{httpOnly:true, maxAge: 3600000})
        res.cookie("refresh_token","",{httpOnly:true, maxAge: 3600000})
        res.send({
            status:"ok",
            logout:true,
            msg:"user logged out!"
        })
    }
    else{
        res.send({
            status:"nok",
            logout:false,
            msg:"not logged in!"
        })
    }
})

module.exports = user_gets