import axios from "axios"
import AES from "crypto-js/aes"
import utf8 from "crypto-js/enc-utf8"
import { SHA256 } from "crypto-js"

const enc_function =async (element:any) =>{
    element=await AES.encrypt(JSON.stringify("_padding_"+element+"_padding_"),key).toString()
    return element
}

const dec_function = async(element:any)=>{
    if(element==="L0#root") return element
    element=await AES.decrypt(element, key).toString(utf8)
    console.log(element)
    element=element.replace(`"_padding_`,"").replace(`_padding_"`,"")
    return element
}

const parse_nodes = async (tree:any,e_fnc:any) =>{

    let newState:any=[]

    for(let i=0;i<tree.length;i++){
        let element=tree[i]

        let newPaths:any=[]


        for (let j=0;j<element.nextPaths.length;j++){
            let e=element.nextPaths[j]
            let encrypted_path_token=await e_fnc(e)
            newPaths.push(encrypted_path_token)
        }
        let new_obj={
            level:await e_fnc(element.level),
            currentPath:await e_fnc(element.currentPath),
            nextPaths:newPaths
        }
        newState.push(new_obj)
    }

       
   
    return newState
}




const update_post_tree = (newState:any) =>{

    return async(dispatch:any, getState:any)=>{
        let parsed_nodes = await parse_nodes(newState, enc_function)
        let normal_nodes = await parse_nodes(newState, (node:any)=>node)
        console.log(parsed_nodes)
        let resp = await axios.put("http://localhost:3001/private-entries-api/update-tree",{tree:parsed_nodes},{ withCredentials: true })
        if(resp.data.status==="ok"){
            dispatch({
                type:"UPDATE_TREE",
                tree:normal_nodes
            })
        }
    }
}

const key = localStorage.getItem("enc") as string

const update_current_path = (selectedNodes:any)=>{
   
    return async (dispatch:any, getState:any)=>{
        console.log(key)
        let current_path:any=[]
        let normal_current_path:any=[]
        for (let i=0; i<selectedNodes.length;i++){

            //let encrypted_path_token= AES.encrypt(selectedNodes[i].currentPath, key).toString()
            let encrypted_path_token= SHA256(selectedNodes[i].currentPath).toString()
            current_path.push(encrypted_path_token)
            normal_current_path.push(selectedNodes[i].currentPath)
        }

        dispatch({
            type:"UPDATE_CURRENT_PATH",
            paths:{
                path:current_path,
                normal_path:normal_current_path
            }
        })
    }
    
}

const fetch_post_tree = ()=>{
    return async(dispatch:any, getState:any)=>{
        let resp = await axios.get("http://localhost:3001/private-entries-api/user-tree",{withCredentials:true})
        console.log(resp.data.tree.nodes)
        let dec =  await parse_nodes(resp.data.tree.nodes,dec_function)
        console.log(resp.data)
        if(resp.data.status==="ok"){
            dispatch({
                type:"UPDATE_TREE",
                tree:dec
            })
        }

    }
}


const refresh_posts = () =>{
    return (dispatch:any,getState:any)=>{
        dispatch({
            type:"REFRESH_POSTS"
        })
    }
}

const reset_refresh = () =>{

    return (dispatch:any,getState:any)=>{
        dispatch({
            type:"RESET_REFRESH"
        })
    }
}


export default {update_post_tree,fetch_post_tree,update_current_path,refresh_posts,reset_refresh}