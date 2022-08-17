import CodeEditor from '@uiw/react-textarea-code-editor';
import { useRef, useEffect, useState } from "react"
import CloseCircleIcon from "../../svgs/CloseCircle"
import ArrowDownIcon from "../../svgs/DownShortArrow"
import DownArrowUp from "../../svgs/DownArrowUp"
import CodeIcon from "../../svgs/CodeIcon"
import classes from "./NewEntry.module.css"
import AddCircle from "../../svgs/AddCircle"
import NewImage from "./NewImage"
import useHttp from "../Hooks/useHttpRequest"
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import AES from "crypto-js/aes"
import utf8 from "crypto-js/enc-utf8"
import { useSelector } from "react-redux"
import { motion } from 'framer-motion';
import { ScrlState } from "../Store/Store"
import Actions from "../Actions/Actions"
import {useDispatch} from "react-redux"
interface EntryProps{
    closeModal:any,
}
const NewEntry:React.FC<EntryProps> = (props) =>{
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const leftBarRef = useRef<HTMLDivElement>(null)
    const [showContent,setShowContent]=useState(true)
    const [showImages, setShowImages] = useState(false)

    const dispatch = useDispatch()

    const currentPath = useSelector<ScrlState,any>(state=>state.CurrentPathReducer.path)

    const selectRef=useRef<HTMLSelectElement>(null)

    const imageInputRef = useRef<HTMLInputElement>(null)





    const [selectedFontSize, setSelectedFontSize] = useState(16)

    const [selectedLanguage, setSelectedLanguage] = useState("none")

    const onChangeFont = (element:any) =>{
        console.log(element.target.value)
        setSelectedFontSize(element.target.value)
    }

    const onChangeLanguage = (element:any) =>{
        console.log(element.target.value)
        setSelectedLanguage(element.target.value)

    }


    let [selectedImages,setSelectedImages]= useState<any>([])

    const [post_content, set_post_content] = useState("")
    const [post_title, set_post_title] = useState("")


    let base64_images:any = []

    let encrypted_base64_images:any=[]


    const read_image = ( image:any) =>{
         const fileReader = new FileReader()
        return new Promise((resolve, reject)=>{
            fileReader.onerror = () =>{
                fileReader.abort()
                reject(new DOMException("Problem parsing the file"))
            }         
            
            fileReader.onload = () =>{
                resolve(fileReader.result)
            }

            fileReader.readAsDataURL(image)

        })
        }
        
        
        

        



    const [test_dec,set_test_dec] = useState<any>([])



    const {isLoading:sendPostLoading, isError:sendPostError, send_request:send_public_post } = useHttp()
    
    const clickSelect = () =>{
          console.log("aici")
            if(selectRef.current!==null)
             selectRef.current.click()
    }

    const goNext = ()=>{
     
     setShowContent(false)
    }
    const addImage =()=>{
        if (imageInputRef!==null){
            imageInputRef.current?.click()
        }
    }
    const goBack = () =>{
      
        setShowContent(true)
    }
    const submitPost = async() =>{
        //get key

        const key = localStorage.getItem("enc") as string


        //FILTER IMAGES
     
        interface image_object_type{
            image_name:string,
            image_data:string
        }
        let image_objects:image_object_type[]=[]


        for(let i=0; i<selectedImages.length;i++){

            let rez =await read_image(selectedImages[i])
                base64_images.push(rez)

                let enc=await AES.encrypt(rez as string, key)
                let cryptotext=enc.toString()
                encrypted_base64_images.push(cryptotext)

                let enc_image_name=await AES.encrypt(selectedImages[i].name as string, key).toString()

                let image_object = {
                    image_name: enc_image_name,
                    image_data:cryptotext
               }

               image_objects.push(image_object)
        }
        


        //CREATE POST OBJECT


        let encrypted_title = await AES.encrypt(post_title, key).toString()

        let encrypted_content =  await AES.encrypt(post_content, key).toString()

        let encrypted_language = await AES.encrypt(selectedLanguage, key).toString()

        let encrypted_font_size= await AES.encrypt(String(selectedFontSize), key).toString()
        

        

        //send request
        
        const request_data={
            url:"http://localhost:3001/private-entries-api/postentry",
            method:"POST",
            body:{
                title:encrypted_title,
                content:encrypted_content,
                language:encrypted_language,
                font_size:encrypted_font_size,
                images:image_objects,
                path:currentPath
            }
        }

        send_public_post(request_data,((data:any)=>{
            if(data.status==="ok"){
                props.closeModal()
                dispatch(Actions.refresh_posts() as any)
            }
            else{
               
            }
        }))

    
        
    }

    const removeImage = (image:any) =>{
        setSelectedImages((old:any)=>{
            return old.filter((item:any)=>item!==image)
        })
    }

    const toggleShowImages = () =>{
        setShowImages(state=>!state)
    }


    const handleNewFile = (event:any) =>{
        setSelectedImages((old: any)=>[...old, event.target.files[0]])
    }

    useEffect( ()=>{
        window.addEventListener("resize",()=>{
            setInnerW(window.innerWidth)
        })
    },[])

    const [innerW, setInnerW] = useState(window.innerWidth)
    return(
        <div style={{
            display:"grid",
            width:"100vw",
            height:"100vh",
            overflowX:"hidden",
            gridTemplateColumns:innerW>=768?"1fr 5fr 1fr":"1fr 12fr 1fr",
        }}>

        <div className=' bg-ppink ' style={{
            width:"100%"
        }}>
           
        <motion.div


            initial={{
                width:"0%"
                
            }}

            animate={{
                width:"100%"
            }}

            transition={{
                duration:0.5
            }}





        
        
        className='w-full bg-ppink md:bg-pgray h-full'>

        </motion.div>
        </div>
        <div className=' w-full h-full flex justify-center items-center'>
        <motion.div 



            initial={{
                marginTop:-5000
                
            }}

            animate={{
                marginTop:0
            }}

            transition={{
                duration:0.35
            }}

        
        
        
        className=" w-11/12   ">
        
            <div className=" bg-porange h-12 flex justify-between items-center p-2  ">
                <div>
                    {showContent&&
                    <div>
                    <p className="text-white">
                    {
                        selectedLanguage==="none"?"Language: normal":
                        `Language: ${selectedLanguage}`
                    }
                    </p>
                    </div>
                    
                    }
                      {!showContent&&
                    <p className="text-white">
                    Title
                    </p>
                    }
                </div>
                <div className=" cursor-pointer" onClick={props.closeModal}>
                <CloseCircleIcon height={25} width={25} color={"white"}></CloseCircleIcon>
                </div>

            </div>
            <div className={` flex `} >
          
            {showContent?
            <div className="w-full h-full overflow-y-auto" style={{height:window.innerHeight/1.75}}>

            <CodeEditor
              value={post_content}
              onChange={(env)=>{set_post_content(env.target.value)}}
              language={selectedLanguage}
              placeholder=""
              padding={15}
              style={{
                minHeight:window.innerHeight/1.75,
                backgroundColor:"#2F2F2F",
                color:"white",
                fontFamily:
                  "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                fontSize:Number(selectedFontSize)
              }}
            />
          </div>:
            <textarea
            value={post_title}
            onChange={(env)=>{set_post_title(env.target.value)}}
             className=" bg-pgray text-white p-4  border-none outline-none h-full w-full resize-none  " ref={textAreaRef} >

            </textarea>
            }

           
          
            </div>
            <div className={` h-fit w-full bg-porange flex justify-between items-center`}>
             <div className="flex items-center p-2  gap-2" >
                <div className='flex cursor-pointer' onClick={toggleShowImages}>
            <div className='flex relative items-center'>
            <div className="absolute left-11 flex items-center ">
                {!showImages?
                <ArrowDownIcon height={30} width={30} color={"white"}></ArrowDownIcon>:
                <DownArrowUp  height={30} width={30} color={"white"}></DownArrowUp>
                }
            </div>
            <button className=" text-white absolute left-0 mb-1  ">
             Images
            </button>
            </div>
            </div>
            {showContent&&
            <div className=' flex items-center gap-1 items-center  ml-16 ' >
                
            <select onChange={onChangeLanguage} className=' w-8 opacity-0 absolute cursor-pointer ' ref={selectRef}><option value="">Language: none</option><option value="abap">Language: abap</option><option value="aes">Language: aes</option><option value="apex">Language: apex</option><option value="azcli">Language: azcli</option><option value="bat">Language: bat</option><option value="brainfuck">Language: brainfuck</option><option value="c">Language: c</option><option value="cameligo">Language: cameligo</option><option value="clike">Language: clike</option><option value="clojure">Language: clojure</option><option value="coffeescript">Language: coffeescript</option><option value="cpp">Language: cpp</option><option value="csharp">Language: csharp</option><option value="csp">Language: csp</option><option value="css">Language: css</option><option value="dart">Language: dart</option><option value="dockerfile">Language: dockerfile</option><option value="erlang">Language: erlang</option><option value="fsharp">Language: fsharp</option><option value="go">Language: go</option><option value="graphql">Language: graphql</option><option value="handlebars">Language: handlebars</option><option value="hcl">Language: hcl</option><option value="html">Language: html</option><option value="ini">Language: ini</option><option value="java">Language: java</option><option value="javascript">Language: javascript</option><option value="json">Language: json</option><option value="jsx">Language: jsx</option><option value="julia">Language: julia</option><option value="kotlin">Language: kotlin</option><option value="less">Language: less</option><option value="lex">Language: lex</option><option value="livescript">Language: livescript</option><option value="lua">Language: lua</option><option value="markdown">Language: markdown</option><option value="mips">Language: mips</option><option value="msdax">Language: msdax</option><option value="mysql">Language: mysql</option><option value="nginx">Language: nginx</option><option value="objective-c">Language: objective-c</option><option value="pascal">Language: pascal</option><option value="pascaligo">Language: pascaligo</option><option value="perl">Language: perl</option><option value="pgsql">Language: pgsql</option><option value="php">Language: php</option><option value="plaintext">Language: plaintext</option><option value="postiats">Language: postiats</option><option value="powerquery">Language: powerquery</option><option value="powershell">Language: powershell</option><option value="pug">Language: pug</option><option value="python">Language: python</option><option value="r">Language: r</option><option value="razor">Language: razor</option><option value="redis">Language: redis</option><option value="redshift">Language: redshift</option><option value="restructuredtext">Language: restructuredtext</option><option value="ruby">Language: ruby</option><option value="rust">Language: rust</option><option value="sb">Language: sb</option><option value="scala">Language: scala</option><option value="scheme">Language: scheme</option><option value="scss">Language: scss</option><option value="shell">Language: shell</option><option value="sol">Language: sol</option><option value="sql">Language: sql</option><option value="st">Language: st</option><option value="stylus">Language: stylus</option><option value="swift">Language: swift</option><option value="systemverilog">Language: systemverilog</option><option value="tcl">Language: tcl</option><option value="toml">Language: toml</option><option value="tsx">Language: tsx</option><option value="twig">Language: twig</option><option value="typescript">Language: typescript</option><option value="vb">Language: vb</option><option value="vbscript">Language: vbscript</option><option value="verilog">Language: verilog</option><option value="vue">Language: vue</option><option value="xml">Language: xml</option><option value="yaml">Language: yaml</option></select>
            <div className='  flex items-center  '>
            
            <CodeIcon width={30} height={30} color={"white"} onClick={clickSelect} className=" cursor-pointer"></CodeIcon>
            
            </div>
  
            </div>
                  }
            {showContent&&  
            <div>
                <input type="number" min="0" max="100" defaultValue="16"  className=" w-12    bg-porange hover:bg-pgray text-white" onChange={onChangeFont}></input>
            </div>
            }
            </div>
            <div >
            {showContent?
                <button className=" text-white p-4" onClick={goNext}>
                    Next
                </button>:
                <div className=" flex gap-2">
                    <button className=" text-white p-2" onClick={goBack}>
                    Back
                    </button>
                    <button className=" text-white p-2" onClick={submitPost}>
                    Submit
                    </button>
                </div>

            }   
            </div>
            
           
          
            </div>
            <div className=" relative ">
 
            <div className={ ` w-full flex gap-6 flex-wrap ${classes.images_before}  ${showImages&&classes.images_after}  break-all`} >
               {selectedImages!==undefined&&selectedImages.map((image:any,index:any)=>{
                   return <NewImage imageName={image.name} key={index} imageObject={image} removeImage={removeImage}/>

               })}
            
                   <input className=" hidden" type="file" ref={imageInputRef} onChange={handleNewFile}> 
                   </input>
                   <AddCircle height={30} width={30}  onClick={addImage}>
                       
                   </AddCircle>

            </div>

            

            </div>
            
            </motion.div>
            </div>
            <div className='w-full w-0 md:w-full bg-pgray'>
            <motion.div 


                initial={{
                    width:"100%"
                    
                }}

                animate={{
                    width:"0%"
                }}

                transition={{
                    duration:0.5
                }}

        
            
            
            
            className=' bg-ppink w-full h-full'>

            </motion.div>
            </div>
            </div>

    )
}

export default NewEntry