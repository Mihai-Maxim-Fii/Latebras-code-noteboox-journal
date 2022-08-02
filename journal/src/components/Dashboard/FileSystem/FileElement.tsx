import {useState, useEffect} from "react"
import {motion} from "framer-motion"
import ModalWrapper from "../../Utility/ModalWrapper"
import {useDispatch} from "react-redux"
import ChevronDown from "../../../svgs/ChevronDown"
import ChevronUp from "../../../svgs/ChevronUp"
interface FileElementProps{
    currentPath:string,
    nextPaths:string[],
    displayOptions:string,
    setDisplayOptions:any,
    appendNode:any,
    displayAdd:any,
    removeFolder:any,
    closeFolder:any,
    index:number
}

const FileElement:React.FC<FileElementProps> = (props) =>{
    const [showOptions, setShowOptions] = useState(false)
    const [showModal, setShowModel] = useState(false)
    const dispatch = useDispatch()
    return (
       <div className=" h-full relative flex flex-col justify-center  w-full">
          <div className="flex cursor-pointer text-white justify-between bg-porange p-2 w-full" onClick={()=>{
              props.setDisplayOptions((old:any)=>{
                  let new_options = old.map((elem:any)=>"false")
                  if(old[props.index]==="false")
                  new_options[props.index]="true"
                  else{
                    if(new_options[props.index]===undefined){
                        new_options[props.index]="true"
                    }
                  }


                  return new_options
              })
          }}>
        <div className=" flex">
          <p >
              {`${props.currentPath.split("#")[1]}/`}
          </p>
        </div>
        <div className="flex items-center">
        {props.displayOptions==="false"?
          <ChevronDown style={{
              width:"1.25rem",
              height:"1.25rem"
          }}></ChevronDown>:
          <ChevronUp
          style={{
            width:"1.25rem",
            height:"1.25rem"
        }}></ChevronUp>
        }
          </div>
          </div>
          
          {props.displayOptions==="true"&&
          <motion.div 
          

       
          
          className=" bg-ppink   rounded-b-md flex flex-col  rounded-b-lg  shadow-black shadow-sm text-black" style={{
              minWidth:"12rem"
          }}>
              {
                  props.nextPaths.map((prp:any,index:number)=>{
                      return <motion.p
                      

                      onClick={()=>{
                          props.appendNode(props.currentPath,prp)
                          setShowOptions(false)
                      }}
                 className="p-2 cursor-pointer text-center hover:bg-pgray hover:text-white  border-black shadow-inner " key={index}>{prp.split("#")[1]}
                      
                      
                      
                      
                      </motion.p>
                      


                  })
                 
              }
             
              <div className="flex   justify-center  text-white  rounded-b-lg  "> 
               <motion.button onClick={()=>{props.displayAdd(props.currentPath)}}  className=" p-1 w-1/2 text-md bg-porange hover:bg-pgray hover:text-white "
               
             >
                  
                  Add

                 </motion.button>
                 <motion.button onClick={()=>{props.closeFolder(props.currentPath)}}  className=" p-1 w-1/2 text-md bg-porange hover:bg-pgray hover:text-white "
               
             >
                  
                  Close
                 </motion.button>


                 <motion.button onClick={()=>props.removeFolder(props.currentPath)}  className=" p-1 w-1/2 text-md bg-porange hover:bg-pgray hover:text-white"
               
                >
                  
                  Delete
                
                 </motion.button>
                 </div>
                
          </motion.div>
            }
      
       </div>
    )
}
export default FileElement