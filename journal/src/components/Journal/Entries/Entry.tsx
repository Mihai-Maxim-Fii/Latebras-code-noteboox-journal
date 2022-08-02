import OpenInNewIcon from "../../../svgs/OpenNew"
import DeleteIcon from "../../../svgs/DeleteIcon"
import ImageIcon from "../../../svgs/ImagesIcon"
import EntryImageViewer from './EntryImageViewer'
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import CodeEditor from '@uiw/react-textarea-code-editor'

interface EntryData{
    title:string,
    date:string,
    images:any,
    font_size:string,
    language:string,
    content:string,
    children:any,
    change_drag:any

}



const Entry:React.FC<EntryData> = (props) =>{

const [drag, setDrag] = useState(true)
    
const [fullView, setFullView] = useState(false)

    const toggleImageViewer = () =>{
        setShowImageViewer(!showImageViewer)
    }
    
    const [showImageViewer, setShowImageViewer] = useState(false)

    const hasImages=props.images.length>0

   
    
    return (<motion.div 

    drag={false}
    dragMomentum={false}
    onMouseOver={()=>{}}
   
    className=" bg-pgray text-white flex flex-col w-full h-full   shadow-black shadow-sm ">
        <div className=" flex justify-between break-all  p-2 bg-porange   text-red-100  cursor-move"  onMouseOver={()=>setDrag(true)} onMouseOut={()=>setDrag(false)}
         
        
        >
            <div className=" self-start">
                {props.date
                }
            </div>
            <div className=" flex ">
                {hasImages&&
            <div>
                {showImageViewer&&
                <EntryImageViewer images={props.images} close={toggleImageViewer}></EntryImageViewer>}
            <div className=" cursor-pointer" onClick={toggleImageViewer}>
                <ImageIcon height={25} width={25} color={"white"}>

                </ImageIcon>
            </div>
            </div>
                }
            <div className=" cursor-pointer">
                <DeleteIcon height={25} width={25} color={"white"}>
                    
                </DeleteIcon>
            </div>
            <div className=" cursor-pointer">
            <OpenInNewIcon height={25} width={25} onClick={()=>{setFullView(old=>!old)}} color={"white"}></OpenInNewIcon>
            </div>
            </div>
          
        </div>
        
        <div className=" p-2 flex justify-center break-all w-full  bg-ppink text-black cursor-move"  onMouseOver={()=>{
            props.change_drag(true)
           }}>
            
            <p>
                {props.title}
            </p>
        </div>
        <div  style={{
            overflowY:"scroll",
            minHeight:"200px",
            maxHeight:window.innerHeight/2
        }} onMouseOver={()=>{
            props.change_drag(false)
           }} >
            <CodeEditor
              value={props.content}

              language={props.language}
              readOnly={true}
              placeholder=""
              padding={15}

              style={{


                backgroundColor:"#363333",
                fontFamily:
                  "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                fontSize:Number(props.font_size)
              }}
              ></CodeEditor>
        </div>
       
    </motion.div>)
}

export default Entry