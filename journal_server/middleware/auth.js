const jwt = require("jsonwebtoken")
let refresh_tkns = require("../models/refresh_tokens")
const {UserModel, PublicUserModel} = require("../models/user-schemas")

const verify_user =async (req, res, next) => {

    console.log("New request: ", req.url)
    var user_data=""
    if (req.cookies["access_token"] !== undefined && req.cookies["refresh_token"]) {
        
            try{
                jwt.verify(req.cookies["access_token"], process.env.JWT_TOKEN)
                req.logged = true
                req.log_msg = "all tokens ok"
                user_data=jwt.decode(req.cookies["access_token"],process.env.JWT_TOKEN)
         
               }
               catch(err){
                   
                if (refresh_tkns.get_refresh_tokens().includes(String(req.cookies["refresh_token"]))) {

                    try{

                     jwt.verify(req.cookies["refresh_token"], process.env.JWT_REFRESH_TOKEN)
                     req.logged = true
                     req.log_msg = "access token refreshed"
                     
                     user_data=jwt.decode(req.cookies["refresh_token"],process.env.JWT_REFRESH_TOKEN)
                     
                     const new_access_token = jwt.sign({username:user_data.username, password:user_data.password}, process.env.JWT_TOKEN, {expiresIn: '10s'})

                     req.new_access_token=new_access_token
                    
                     res.cookie("access_token",new_access_token,{httpOnly:true, maxAge: 3600000})

                


                    }
                    catch(err){
                        req.logged = false
                        req.log_msg = "invalid refresh and access token"
                       
                        refresh_tkns.remove_refresh_token(req.cookies["refresh_token"])
                        res.cookie("access_token","",{httpOnly:true, maxAge: 3600000})
                        res.cookie("refresh_token","",{httpOnly:true, maxAge: 3600000})
                        
                    }
                   
         
                 } else {
                     req.logged = false
                     req.log_msg = "invalid refresh token"
                     refresh_tkns.remove_refresh_token(req.cookies["refresh_token"])
                     res.cookie("access_token","",{httpOnly:true, maxAge: 3600000})
                     res.cookie("refresh_token","",{httpOnly:true, maxAge: 3600000})
                 }
               }
               
    } else {
        req.logged = false
        req.log_msg = "acces token or refresh token is missing"
        refresh_tkns.remove_refresh_token(req.cookies["refresh_token"])
        res.cookie("access_token","",{httpOnly:true, maxAge: 3600000})
        res.cookie("refresh_token","",{httpOnly:true, maxAge: 3600000})
    }
    
    next()
}

module.exports = verify_user
