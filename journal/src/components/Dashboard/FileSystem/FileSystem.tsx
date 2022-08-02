import { useState, useRef, useEffect } from "react"
import FileElement from "./FileElement"
import { useSelector } from "react-redux"
import { ScrlState } from "../../Store/Store"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router"
import axios from "axios"
import actions from "../../Actions/Actions"
import { AnyAction } from "redux"
const FileSystem:React.FC =()=>{

   

    const treeState =  useSelector<ScrlState,any>(state=>state.FolderTreeReducer)

    const currentPathState=  useSelector<ScrlState,any>(state=>state.CurrentPathReducer)
    
    const [allFileNodes,setAllNodes] = useState(treeState)

    const currentElementsRef = useRef<HTMLDivElement>(null)

    const [currentIndex,setCurrentIndex]= useState(0)
     

   



    const dispatch = useDispatch()
    
    const [currentFileNodes,setCurrentFileNodes] = useState([allFileNodes[0]])

    const [showOptions, setShowOptions] = useState(currentFileNodes.map(key=>"false"))




    useEffect( ()=>{
       dispatch(actions.update_current_path(currentFileNodes)as any)
       setShowOptions(old=>old.map(elem=>"false"))
       console.log("aici")
       

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

    const removeFolder = (from:string) => {
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

       new_all= new_all.filter((element:any)=>!nodes_to_be_deleted.includes(element))
       
       
       
       
    
       setAllNodes(new_all)
       dispatch(actions.update_post_tree(new_all)as any)
       setCurrentFileNodes(new_current)
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
    <div  ref={currentElementsRef} className=" flex flex-col items-start gap-1 w-full flex-wrap  ">

       
        {currentFileNodes.map((node:any,index:number)=>{
            if(index>=currentIndex)
            return (<div className=" z-50 w-full " key={node.currentPath}>
                <FileElement key={node.currentPath} index={index} displayOptions={showOptions[index]} setDisplayOptions={setShowOptions} currentPath={node.currentPath} nextPaths={node.nextPaths} displayAdd={displayAdd} removeFolder={removeFolder} closeFolder={closeFolder}  appendNode={appendNode}/>
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