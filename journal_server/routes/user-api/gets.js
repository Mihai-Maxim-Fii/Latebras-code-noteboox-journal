const express = require("express")
const user_gets = express.Router()
let refresh_tkns = require("../../models/refresh_tokens")

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
        refresh_tkns.remove_refresh_token(req.cookies["refresh_token"])
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