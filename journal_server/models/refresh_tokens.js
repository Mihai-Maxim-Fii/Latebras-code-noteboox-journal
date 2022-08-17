let user_refresh_tokens=[]

const add_refresh_token = (token)=>{
    user_refresh_tokens.push(token)
    console.log(user_refresh_tokens)
}

const remove_refresh_token = (token) =>{
    user_refresh_tokens=user_refresh_tokens.filter(t=>t!==token)
}

const get_refresh_tokens = () =>{
    return user_refresh_tokens
}
module.exports={get_refresh_tokens, add_refresh_token, remove_refresh_token}