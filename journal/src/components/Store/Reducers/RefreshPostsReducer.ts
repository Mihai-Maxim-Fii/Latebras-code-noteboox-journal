

interface RefreshPosts{
    refresh:boolean
}



const RefreshPostsReducer = (state:RefreshPosts={refresh:false}, action:any)=>{
    if(action.type==="REFRESH_POSTS"){
        return {
            refresh:true
        }
    }
    else
    if(action.type==="RESET_REFRESH"){
        return {
            refresh:false
        }
    }
    else
    {
        return state
    }

}
export default RefreshPostsReducer