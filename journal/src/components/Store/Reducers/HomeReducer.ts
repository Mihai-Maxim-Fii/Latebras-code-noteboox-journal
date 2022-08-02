interface HomeState{
    inHome:boolean,
    inLogin:boolean
}

interface HomeAction{
    type:string
}



const HomeReducer = (state:HomeState, action:HomeAction)=>{
   if(action.type==="IN_HOME"){
       const newState:HomeState={
           inHome:true,
           inLogin:false
       }
       return newState
   }
   else
   if(action.type==="NOT_IN_HOME"){
    const newState:HomeState={
        inHome:false,
        inLogin:false
    }
    return newState
    }
    else
    if(action.type==="IN_LOGIN"){
        const newState:HomeState={
            inHome:false,
            inLogin:true
        }
        return newState
    }
    else
    if(action.type==="NOT_IN_LOGIN"){
        const newState:HomeState={
            inHome:false,
            inLogin:false
        }
        return newState
    }


    else{
        const newState:HomeState={
            inHome:true,
            inLogin:false
            
        }

        return newState
    }
}


export default HomeReducer