

interface TreeState{
    level:number,
    currentPath:string,
    nextPaths:[]
}




const FolderTreeReducer = (state:TreeState[]=[], action: any)=>{
    if(action.type==="UPDATE_TREE"){
       
       return action.tree
    }

    else
    {
        
    return state
}

}

export default FolderTreeReducer