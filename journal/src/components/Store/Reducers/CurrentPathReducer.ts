import CryptoJS from "crypto-js"

interface CurrentPath{
    path:[string],
    normal_path:[string]
}

const defState:CurrentPath={
    path:[""],
    normal_path:[""]
}

const CurrentPathReducer = (state:CurrentPath=defState, action:any)=>{
    if(action.type==="UPDATE_CURRENT_PATH"){
        return action.paths
    }
    else{
        return state
    }

}
export default CurrentPathReducer