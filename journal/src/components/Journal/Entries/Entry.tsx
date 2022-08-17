import OpenInNewIcon from "../../../svgs/OpenNew"
import DeleteIcon from "../../../svgs/DeleteIcon"
import ImageIcon from "../../../svgs/ImagesIcon"
import EntryImageViewer from './EntryImageViewer'
import React, { useRef } from "react"
import { useEffect, useState, useImperativeHandle, useCallback } from "react"
import { motion } from "framer-motion"
import CodeEditor from '@uiw/react-textarea-code-editor'
import ArrowMinimise from "../../../svgs/ArrowMinimise"
import AES from "crypto-js/aes"
import utf8 from "crypto-js/enc-utf8"
import Actions from "../../Actions/Actions"
import axios from "axios"
import { useDispatch } from "react-redux"
import ModalWrapper from "../../Utility/ModalWrapper"
import useHttp from "../../Hooks/useHttpRequest"

interface EntryData{
    title:string,
    date:string,
    refresh:boolean,
    expand_post:any,
    reset_submit:any,
    images:any,
    update_post:any,
    delete_images:any,
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






const Entry:React.FC<EntryData> = React.forwardRef<HTMLDivElement, EntryData>((props,ref) =>{

       const dispatch = useDispatch()
       const {isLoading:editLoading, isError:editError, send_request:edit_posts } = useHttp()
       const {isLoading:deleteLoading, isError:deleteError, send_request:delete_posts } = useHttp()
       const submitPost = async() =>{
        //get key
    
        const key = localStorage.getItem("enc") as string
    
    
        //FILTER IMAGES
     
        interface image_object_type{
            image_name:string,
            image_data:string
        }
        let image_objects:image_object_type[]=[]
    
        let all_images = [...props.images,...props.new_images].filter(img=>!props.delete_images.includes(img))

        console.log(all_images)
        console.log("to delete", props.delete_images)

    
    
        for(let i=0; i<all_images.length;i++){
            let enc_image_data=await AES.encrypt(all_images[i].image_data as string, key).toString()
            let enc_image_name=await AES.encrypt(all_images[i].image_name as string, key).toString()
    
            let image_object = {
                    image_name: enc_image_name,
                    image_data: enc_image_data
               }
    
            image_objects.push(image_object)
        }
        
    
    
        //CREATE POST OBJECT
    
    
        let encrypted_title = await AES.encrypt(post_title, key).toString()
    
        let encrypted_content =  await AES.encrypt(post_content, key).toString()

        let encrypted_language = await AES.encrypt(language_state, key).toString()
    
        
    
        
    
        //send request
        
        const request_data={
                url:"http://localhost:3001/private-entries-api/update-post",
                method:"PATCH",
                body:{
                title:encrypted_title,
                content:encrypted_content,
                images:image_objects,
                key:props.currently_expanded_post,
                language:encrypted_language,
                }
            }

       // axios.patch("http://localhost:3001/private-entries-api/update-post",request_data,{withCredentials:true}).then(resp=>console.log(resp))
        set_show_modal(true)
        edit_posts(request_data, (data:any) =>{
            console.log(data)
        })



    
       
    
    
        
    }




   const title_ref = useRef<HTMLInputElement>(null)
   const content_ref = useRef<HTMLTextAreaElement>(null)


  useEffect( ()=>{

      if(props.update_post===props.post_key){
        props.reset_submit()
        submitPost()
      }
  },[props.update_post])

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
        set_language_state(props.language)

    }

    const text_change_handler = (event:any)=>{
        set_post_content(event.target.value)
    }

    const title_change_handler = (event:any)=>{
        set_post_title(event.target.value)
    }

    const close_modal = () =>{
        set_show_modal(false)
        handle_expand_post(props.currently_expanded_post)
        dispatch(Actions.refresh_posts() as any)

    }

    const [show_delete_modal, set_show_delete_modal] = useState(false)

    const delete_post = () =>{
        const request_data={
            url:"http://localhost:3001/private-entries-api/delete-post?key="+props.post_key,
            method:"DELETE",
        }
    delete_posts(request_data, (data:any) =>{
        console.log(data)
    })
    set_show_loading_request(true)

        
    }

    const [language_state, set_language_state] =  useState(props.language)
    const change_language = (event:any)=>{
        set_language_state(event.target.value)

    }


    const [show_modal, set_show_modal] = useState(false)

    const [show_loading_request, set_show_loading_request] = useState(false)

    return (
    
    <motion.div 

    ref={ref}

    drag={false}
    dragMomentum={false}

    
   
    className={` bg-pgray text-white flex flex-col w-full h-full   shadow-black shadow-sm  `}
    
    
    >
        {show_modal&&
        <ModalWrapper>
            <div className=" bg-pgray shadow-black shadow-sm text-white w-80 h-fit flex flex-col items-center justify-center mt-24">
                <div className=" p-4">
                {editLoading&&
                <p>
                    Editing entry...
                </p>}
                {editError&&
                <p>
                    Server error, the entry could not be edited.
                </p>}

                {(!editLoading && !editError)&&
                <p>
                  Your entry was edited successfully!</p>}
                  </div>
                {(!editLoading && !editError)&&
                <div className=" bg-porange text-white w-full p-2 flex justify-end px-4 rounded-b-md">
                    <button className=" hover:scale-105" onClick={close_modal}>Close</button>
                </div>}
            </div>
        </ModalWrapper>
        }

        {show_delete_modal&&
        <ModalWrapper>
            <div className=" bg-pgray shadow-black shadow-sm text-white w-80 h-fit flex flex-col items-center justify-center mt-24">
                {!show_loading_request?
                <div className=" flex justify-center w-full p-4">
                Do you wish to delete this post?
                </div>:<div>
                    {deleteLoading&&
                    <div className=" flex justify-center w-full p-4">
                      Deleting entry...
                    </div>
                    }
                    {deleteError&&
                    <div className=" flex justify-center w-full p-4">
                            Server error, the entry could not be deleted!
                    </div>
                    }
                    {(!deleteLoading&&!deleteError)&&<div className=" flex justify-center w-full p-4">
                            The entry was deleted successfully!
                        </div>}
                </div>
                }   
                {!show_loading_request?
                <div className=" flex justify-end w-full gap-2 bg-porange px-2 py-2">
                    <button className=" hover:scale-105" onClick={()=>set_show_delete_modal(false)}>
                        Cancel
                    </button>
                    <button className="  hover:scale-105" onClick={delete_post}>
                        Yes
                    </button>
                </div>:(!deleteLoading)&&
                <div className=" flex justify-end w-full gap-2 bg-porange px-2 py-2">
                     <button className=" hover:scale-105" onClick={()=>{
                         set_show_loading_request(false)
                         set_show_delete_modal(false)
                         dispatch(Actions.refresh_posts() as any)
                       }
                     }>
                        Close
                    </button>
                    </div>
                }
            </div>
        </ModalWrapper>
        }
       
        <div className=" flex justify-between break-all  p-2 bg-porange   text-red-100 "  onMouseOver={()=>setDrag(true)} onMouseOut={()=>setDrag(false)}
         
        
        >
            <div className=" self-start flex gap-1 items-center text-white">
               <p className=" "> {props.date
                },
                </p>
                <div className=" ">
                   <select  className=' bg-porange  text-white   cursor-pointer appearance-none  ' disabled={props.currently_expanded_post===props.post_key?false:true}  value={language_state} onChange={change_language} ><option value="">Language: none</option><option value="abap">Language: abap</option><option value="aes">Language: aes</option><option value="apex">Language: apex</option><option value="azcli">Language: azcli</option><option value="bat">Language: bat</option><option value="brainfuck">Language: brainfuck</option><option value="c">Language: c</option><option value="cameligo">Language: cameligo</option><option value="clike">Language: clike</option><option value="clojure">Language: clojure</option><option value="coffeescript">Language: coffeescript</option><option value="cpp">Language: cpp</option><option value="csharp">Language: csharp</option><option value="csp">Language: csp</option><option value="css">Language: css</option><option value="dart">Language: dart</option><option value="dockerfile">Language: dockerfile</option><option value="erlang">Language: erlang</option><option value="fsharp">Language: fsharp</option><option value="go">Language: go</option><option value="graphql">Language: graphql</option><option value="handlebars">Language: handlebars</option><option value="hcl">Language: hcl</option><option value="html">Language: html</option><option value="ini">Language: ini</option><option value="java">Language: java</option><option value="javascript">Language: javascript</option><option value="json">Language: json</option><option value="jsx">Language: jsx</option><option value="julia">Language: julia</option><option value="kotlin">Language: kotlin</option><option value="less">Language: less</option><option value="lex">Language: lex</option><option value="livescript">Language: livescript</option><option value="lua">Language: lua</option><option value="markdown">Language: markdown</option><option value="mips">Language: mips</option><option value="msdax">Language: msdax</option><option value="mysql">Language: mysql</option><option value="nginx">Language: nginx</option><option value="objective-c">Language: objective-c</option><option value="pascal">Language: pascal</option><option value="pascaligo">Language: pascaligo</option><option value="perl">Language: perl</option><option value="pgsql">Language: pgsql</option><option value="php">Language: php</option><option value="plaintext">Language: plaintext</option><option value="postiats">Language: postiats</option><option value="powerquery">Language: powerquery</option><option value="powershell">Language: powershell</option><option value="pug">Language: pug</option><option value="python">Language: python</option><option value="r">Language: r</option><option value="razor">Language: razor</option><option value="redis">Language: redis</option><option value="redshift">Language: redshift</option><option value="restructuredtext">Language: restructuredtext</option><option value="ruby">Language: ruby</option><option value="rust">Language: rust</option><option value="sb">Language: sb</option><option value="scala">Language: scala</option><option value="scheme">Language: scheme</option><option value="scss">Language: scss</option><option value="shell">Language: shell</option><option value="sol">Language: sol</option><option value="sql">Language: sql</option><option value="st">Language: st</option><option value="stylus">Language: stylus</option><option value="swift">Language: swift</option>
                 <option  value="systemverilog">Language: systemverilog</option><option value="tcl">Language: tcl</option><option value="toml">Language: toml</option><option value="tsx">Language: tsx</option><option value="twig">Language: twig</option><option value="typescript">Language: typescript</option><option value="vb">Language: vb</option><option value="vbscript">Language: vbscript</option><option value="verilog">Language: verilog</option><option value="vue">Language: vue</option><option value="xml">Language: xml</option><option value="yaml">Language: yaml</option></select>
                </div>
                
                
                
            </div>
            <div className=" flex ">
                {hasImages&&
            <div>
                {showImageViewer&&
                <EntryImageViewer images={[...props.images,...props.new_images]} close={toggleImageViewer}></EntryImageViewer>}
            <div className=" cursor-pointer hover:scale-110" onClick={toggleImageViewer}>
                <ImageIcon height={25}  width={25} color={"white"}>

                </ImageIcon>
            </div>
            </div>
                }
            <div className=" cursor-pointer">
                <DeleteIcon height={25} width={25} onClick={()=>set_show_delete_modal(true)} className=" hover:scale-110" color={"white"}>
                    
                </DeleteIcon>
            </div>
             {props.currently_expanded_post!==props.post_key?
            <div className=" cursor-pointer ">
            <OpenInNewIcon height={25} width={25} className=" hover:scale-110" onClick={()=>{handle_expand_post(props.post_key)}} color={"white"}></OpenInNewIcon>
            </div>:
            <div className=" cursor-pointer ">
             <ArrowMinimise height={25} width={25} className=" hover:scale-110" onClick={()=>{handle_expand_post(props.post_key)}} color={"white"}></ArrowMinimise>

            </div>
            }
            </div>
          
        </div>
        
        <div className=" p-2 flex justify-center break-all w-full  bg-ppink text-black "  onMouseOver={()=>{
            props.change_drag(true)
           }}>
            
            <input onChange={title_change_handler } ref={title_ref} type="text" className="bg-ppink text-center w-full " readOnly={props.currently_expanded_post===props.post_key?false:true} value={post_title}>
            </input>
        </div>
        <div  style={{
            overflowY:"scroll",
            maxHeight:"70vh"
            
        }} onMouseOver={()=>{
            props.change_drag(false)
           }} >
            <CodeEditor
              value={post_content}
              onChange={text_change_handler}

              ref={content_ref}

              language={language_state}
              readOnly={props.currently_expanded_post===props.post_key?false:true}
              placeholder=""
              padding={15}


              style={{


                backgroundColor:"#363333",
                minHeight:"150px",
                fontFamily:
                  "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                fontSize:Number(props.font_size)
              }}
              ></CodeEditor>
        </div>
       
    </motion.div>)
})

export default Entry