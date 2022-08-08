import OpenInNewIcon from "../../../svgs/OpenNew"
import DeleteIcon from "../../../svgs/DeleteIcon"
import ImageIcon from "../../../svgs/ImagesIcon"
import EntryImageViewer from './EntryImageViewer'
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import CodeEditor from '@uiw/react-textarea-code-editor'
import ArrowMinimise from "../../../svgs/ArrowMinimise"

interface EntryData{
    title:string,
    date:string,
    refresh:boolean,
    expand_post:any,
    images:any,
    new_images:any,
    currently_expanded_post:String,
    post_key:string,
    font_size:string,
    language:string,
    content:string,
    children:any,
    change_drag:any,
    handle_close:any


}



const Entry:React.FC<EntryData> = (props) =>{


const [drag, setDrag] = useState(true)
    
const [fullView, setFullView] = useState(false)

    const toggleImageViewer = () =>{
        setShowImageViewer(!showImageViewer)
    }


    const [post_content, set_post_content] = useState(props.content)
    const [post_title, set_post_title] = useState(props.title)
    
    const [showImageViewer, setShowImageViewer] = useState(false)

    const hasImages=props.images.length>0


    const handle_expand_post = (key:String) =>{
        if(props.currently_expanded_post===key)
        props.expand_post("")
        else
        props.expand_post(key)

        props.handle_close(key)

        set_post_content(props.content)
        set_post_title(props.title)

    }

    const text_change_handler = (event:any)=>{
        set_post_content(event.target.value)
    }

    const title_change_handler = (event:any)=>{
        set_post_title(event.target.value)
    }
    
    return (
    
    <motion.div 

    drag={false}
    dragMomentum={false}

    
   
    className={` bg-pgray text-white flex flex-col w-full h-full   shadow-black shadow-sm  `}
    
    
    >
       
        <div className=" flex justify-between break-all  p-2 bg-porange   text-red-100 "  onMouseOver={()=>setDrag(true)} onMouseOut={()=>setDrag(false)}
         
        
        >
            <div className=" self-start">
                {props.date
                }
            </div>
            <div className=" flex ">
                {hasImages&&
            <div>
                {showImageViewer&&
                <EntryImageViewer images={[...props.images,...props.new_images]} close={toggleImageViewer}></EntryImageViewer>}
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
             {props.currently_expanded_post!==props.post_key?
            <div className=" cursor-pointer ">
            <OpenInNewIcon height={25} width={25} onClick={()=>{handle_expand_post(props.post_key)}} color={"white"}></OpenInNewIcon>
            </div>:
            <div className=" cursor-pointer ">
             <ArrowMinimise height={25} width={25} onClick={()=>{handle_expand_post(props.post_key)}} color={"white"}></ArrowMinimise>

            </div>
            }
            </div>
          
        </div>
        
        <div className=" p-2 flex justify-center break-all w-full  bg-ppink text-black "  onMouseOver={()=>{
            props.change_drag(true)
           }}>
            
            <input onChange={title_change_handler} type="text" className="bg-ppink text-center w-full " readOnly={props.currently_expanded_post===props.post_key?false:true} value={post_title}>
            </input>
        </div>
        <div  style={{
            overflowY:"scroll",
            minHeight:"200px",
            maxHeight:"70vh"
            
        }} onMouseOver={()=>{
            props.change_drag(false)
           }} >
            <CodeEditor
              value={post_content}
              onChange={text_change_handler}

              language={props.language}
              readOnly={props.currently_expanded_post===props.post_key?false:true}
              placeholder=""
              padding={15}


              style={{


                backgroundColor:"#363333",
                //backgroundColor:"red",
                fontFamily:
                  "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                fontSize:Number(props.font_size)
              }}
              ></CodeEditor>
        </div>
       
    </motion.div>)
}

export default Entry