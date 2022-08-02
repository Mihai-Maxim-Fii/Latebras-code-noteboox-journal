const jwt = require("jsonwebtoken")
const getTokenData = (req) =>{
    let token=""
    if(req.new_access_token!==undefined)
       token = req.new_access_token
    else
        token = req.cookies["access_token"]
    let decrypted_token = jwt.decode(token,process.env.JWT_TOKEN)
    return decrypted_token


}

module.exports = getTokenData

