
export interface LoginState{
    isLogged:boolean
}

interface LoginAction{
   type:"LOGIN"|"LOGOUT"
}

const loginReducer = (state:LoginState={
    isLogged:false
}, action:LoginAction)=>{
    if(action.type==="LOGIN"){
        const new_state:LoginState={
            isLogged:true
        }
        return new_state
    }
    else
    if(action.type==="LOGOUT"){
        const new_state:LoginState={
            isLogged:false
        }
        return new_state
    }
    else{
         return state
    }
}


export default loginReducer;
