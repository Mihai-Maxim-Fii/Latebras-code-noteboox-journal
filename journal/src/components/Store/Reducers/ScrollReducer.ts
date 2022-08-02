export interface ScrollState{
    showFeatures:boolean,
    showSecurity:boolean
}
 export interface ScrollAction{
    type:string,
    payload:ScrollState
}
const ScrollReducer = (state:ScrollState, action:ScrollAction)=>{
    if(action.type==="FEATURES_VISIBLE"){
        const newState:ScrollState={
            showFeatures:true,
            showSecurity:false
        }
        return newState
    }
    else
    if(action.type==="SECURITY_VISIBLE"){
        const newState:ScrollState={
            showFeatures:false,
            showSecurity:true
        }
        return newState
    }
    else{
        const newState:ScrollState={
            showFeatures:true,
            showSecurity:false
        }
        return newState
    }
}
export default ScrollReducer