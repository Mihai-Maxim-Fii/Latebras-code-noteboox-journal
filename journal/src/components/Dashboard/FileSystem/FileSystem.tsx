import { useState, useRef, useEffect } from "react"
import FileElement from "./FileElement"
import { useSelector } from "react-redux"
import { ScrlState } from "../../Store/Store"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router"
import axios from "axios"
import actions from "../../Actions/Actions"
import { AnyAction } from "redux"
import useHttp from "../../Hooks/useHttpRequest"
import { SHA256 } from "crypto-js"
import ModalWrapper from "../../Utility/ModalWrapper"
import { type } from "os"
const FileSystem:React.FC =()=>{

   

    const treeState =  useSelector<ScrlState,any>(state=>state.FolderTreeReducer)

    const currentPathState=  useSelector<ScrlState,any>(state=>state.CurrentPathReducer)
    
    const [allFileNodes,setAllNodes] = useState(treeState)

    const currentElementsRef = useRef<HTMLDivElement>(null)

    const [currentIndex,setCurrentIndex]= useState(0)
     

   

    

    const dispatch = useDispatch()

    const {isLoading:deleteFoldersLoading, isError:deleteFoldersError, send_request:delete_folders} = useHttp()
    
    const [currentFileNodes,setCurrentFileNodes] = useState([allFileNodes[0]])

    const [showOptions, setShowOptions] = useState(currentFileNodes.map(key=>"false"))


    useEffect( ()=>{
        console.log(treeState, allFileNodes,currentFileNodes)
        let treeStateJson =JSON.stringify(treeState)
        let allFileNodesJson= JSON.stringify(allFileNodes)
        if(treeStateJson!==allFileNodesJson){
           setAllNodes(treeState)
           setCurrentFileNodes([treeState[0]])
        }
    },[treeState])



    useEffect( ()=>{
       dispatch(actions.update_current_path(currentFileNodes)as any)
       setShowOptions(old=>old.map(elem=>"false"))
       

    },[currentFileNodes])


   


    

    const appendNode = (from:string, name:string) =>{
        setShowAdd("")
        
        let current_node = currentFileNodes.filter((node)=>node.currentPath===from)[0]
        if(currentFileNodes.indexOf(current_node)===currentFileNodes.length-1){
            let new_node = allFileNodes.filter((node:any)=>node.currentPath===name)[0]
            setCurrentFileNodes((old)=>[...old,new_node])

        }
        else{
            let short_node_list = currentFileNodes.filter((node)=>currentFileNodes.indexOf(node)<=currentFileNodes.indexOf(current_node))
            let new_node = allFileNodes.filter((node:any)=>node.currentPath===name)[0]
            short_node_list.push(new_node)
            setCurrentFileNodes(short_node_list)

        }
    }

    const addNewNode = ( from:string) =>{
        let from_level = Number(from.split("#")[0].split("L")[1])
        let from_node_current = currentFileNodes.filter( elem=>elem.currentPath===from)[0]
        if(newNodeRef.current?.value!==""){

            let new_node = {
                level:String(from_level+1),
                currentPath:`L${from_level+1}#${newNodeRef.current?.value}`,
                nextPaths:[ ] 
             }

             let new_current = currentFileNodes.filter( elem=>elem!==from_node_current)
             let new_all = allFileNodes.filter( (elem:any)=>elem!==from_node_current)

             from_node_current.nextPaths.push(new_node.currentPath)

             new_current=[...new_current,from_node_current]
             new_all=[...new_all,from_node_current]

             new_all.push(new_node)
             new_current.push(new_node)

             setAllNodes(new_all)
             setCurrentFileNodes(new_current)
             dispatch(actions.update_post_tree(new_all) as any)
             
             setShowAdd("")
             

             

            
        }
    }
    const navigate = useNavigate()

    const [showAdd,setShowAdd] = useState("")
    const newNodeRef= useRef<HTMLInputElement>(null)

    const displayAdd =(from:string)=>{
        let short_list=[]
        let element_index =currentFileNodes.indexOf(currentFileNodes.filter((elem:any)=>elem.currentPath===from)[0])
        for(let i=0;i<currentFileNodes.length;i++){
            if(i<=element_index){
                short_list.push(currentFileNodes[i])
            }
            else{
                break
            }
        }
        setCurrentFileNodes(short_list)
        setShowAdd(from)


    }

    const removeFolder = async(from:string) => {
        let node_current:any = currentFileNodes.filter( elem=>elem.currentPath===from)[0]
        let node_current_parrent:any = currentFileNodes.filter( elem=>elem.nextPaths.includes(from))[0]

        let nodes_to_be_deleted:any = []

        let node_queue=[node_current]



        while(node_queue.length>0){
            let current_node=node_queue.shift()
            nodes_to_be_deleted.push(current_node)
            current_node.nextPaths.forEach((path:any)=>{
                let child_node = allFileNodes.filter((n:any)=>n.currentPath===path)[0]
        
                if(!nodes_to_be_deleted.includes(child_node))
                {

                    node_queue.push(child_node)

                }
            })
        }

       let new_current = currentFileNodes
       let new_all = allFileNodes

       new_current[new_current.indexOf(node_current_parrent)].nextPaths=
       new_current[new_current.indexOf(node_current_parrent)].nextPaths.filter((path:any)=>{
          return path!==from
       })

       new_all[new_all.indexOf(node_current_parrent)].nextPaths=
       new_all[new_all.indexOf(node_current_parrent)].nextPaths.filter((path:any)=>{
          return path!==from
       })

       new_current=new_current.filter(element=>!nodes_to_be_deleted.includes(element))

       new_all = new_all.filter((element:any)=>!nodes_to_be_deleted.includes(element))

       let paths_to_be_deleted = nodes_to_be_deleted.map((node:any)=>SHA256(node.currentPath).toString())

       let url_params={} as any

       paths_to_be_deleted.forEach((path:any,index:number)=>url_params[`q${index}`]=path)

       const request_data={
        url:"http://localhost:3001/private-entries-api/delete-folders"+"?"+new URLSearchParams(url_params),
        method:"DELETE",
        }

        delete_folders(request_data,(resp:any)=>{
            console.log(resp)
            setAllNodes(new_all)
            dispatch(actions.update_post_tree(new_all)as any)
            setCurrentFileNodes(new_current)
        })
      


    }

    const closeFolder = (from:string) => {
        let node_current:any = currentFileNodes.filter( elem=>elem.currentPath===from)[0]

        let nodes_to_be_deleted:any = []

        let node_queue=[node_current]



        while(node_queue.length>0){
            let current_node=node_queue.shift()
            nodes_to_be_deleted.push(current_node)
            current_node.nextPaths.forEach((path:any)=>{
                let child_node = allFileNodes.filter((n:any)=>n.currentPath===path)[0]
        
                if(!nodes_to_be_deleted.includes(child_node))
                {

                    node_queue.push(child_node)

                }
            })
        }

        let new_current = currentFileNodes
 
 
        new_current=new_current.filter(element=>!nodes_to_be_deleted.includes(element))

       setCurrentFileNodes(new_current)
    }

    const [show_delete_dialog, set_show_delete_dialog] = useState(false)

    const [show_delete_status, set_show_delete_status] = useState(false)

    const [current_delete_path, set_current_delete_path] = useState("")

    const trigger_delete = (path:any)=>{
        set_current_delete_path(path)
        set_show_delete_dialog(true)

    }
    

    return (
    
    <div style={{
        display:"flex",
        width:"250px",
        overflow:"auto",
        justifyContent:"center",
        backgroundColor:"#363333",
        alignItems:"center",
        padding:"1.5rem",
        paddingBottom:"4rem",

    }}>
        {show_delete_dialog&&
           <ModalWrapper>
               {!show_delete_status?
               <div className=" w-80 h-fit mt-24 bg-pgray flex flex-col items-center text-white">
               <p className=" p-4">
                   Are you sure you want to delete <strong>{`${current_delete_path.split("#")[1]}`}</strong> and all its subfolders?
               </p>
               <div className=" bg-porange w-full p-2 flex justify-end gap-2">
                   <button className=" hover:scale-105">
                       Cancel
                   </button>
                   <button  className=" hover:scale-105" onClick={
                       ()=>{
                           removeFolder(current_delete_path)
                           set_show_delete_status(true)}
                       }>
                       Delete
                   </button>
               </div>
               </div>:
               <div className=" w-80 h-fit mt-24 bg-pgray flex flex-col items-center text-white">
               {deleteFoldersLoading&&
               <p className=" p-4">
                   Deleting <strong>{`${current_delete_path.split("#")[1]}`}</strong>...
               </p>}
               {deleteFoldersError&&
               <p className=" p-4">
               Server error, <strong>{`${current_delete_path.split("#")[1]}`}</strong> could not be deleted! 
               </p>
               }
               {(!deleteFoldersLoading&&!deleteFoldersError)&&
               <p className=" p-4">
               <strong>{`${current_delete_path.split("#")[1]}`}</strong> has been deleted successfully!
               </p>
               
               }
                {(deleteFoldersError||!deleteFoldersLoading)&&
                  <div className=" bg-porange w-full p-2 flex justify-end gap-2">
                  <button className=" hover:scale-105" onClick={()=>{

                      set_show_delete_dialog(false)
                      set_show_delete_status(false)

                  }}>
                      Ok
                  </button>
              </div>
                }

               </div>
               }
           </ModalWrapper>
           }



    <div  ref={currentElementsRef} className=" flex flex-col items-start gap-1 w-full flex-wrap  ">

       
        {currentFileNodes.map((node:any,index:number)=>{
            if(index>=currentIndex)
            return (<div className=" z-50 w-full " key={node.currentPath}>
                <FileElement trigger_delete={trigger_delete} key={node.currentPath} index={index} displayOptions={showOptions[index]} setDisplayOptions={setShowOptions} currentPath={node.currentPath} nextPaths={node.nextPaths} displayAdd={displayAdd} removeFolder={removeFolder} closeFolder={closeFolder}  appendNode={appendNode}/>
                </div> 
                )
            
            
            
        })}
        {showAdd!==""&&
        <div className="flex items-center flex-col items-center w-full gap-1 mt-2">
           <input ref={newNodeRef} className="text-black bg-white border-white border-2   w-full">

           </input>
           <div className="flex w-full gap-1">
           <button onClick={()=>addNewNode(showAdd)} className=" bg-porange text-white hover:bg-yellow-400 hover:text-white w-full">
               Add
           </button>
           <button onClick={()=>setShowAdd("")} className=" bg-porange text-white hover:bg-ppink hover:text-black w-full">
               Close
           </button>
           </div>
           
        </div>
        }
    </div>
    </div>)
}
export default FileSystem