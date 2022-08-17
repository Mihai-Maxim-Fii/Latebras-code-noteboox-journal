import { useEffect } from "react"
import { useState } from "react"
import classes from "./Entries.module.css"
import Entry from "./Entry" 
import useHttp from "../../Hooks/useHttpRequest"
import AES from "crypto-js/aes"
import utf8 from "crypto-js/enc-utf8"
import { compose } from "redux"
import { motion } from "framer-motion"
import { useSelector } from "react-redux"
import { ScrlState } from "../../Store/Store"
import { useRef } from "react"
import { useDispatch } from "react-redux"
import Actions from "../../Actions/Actions"
import NewImage from "../../NewEntry/NewImage"
import AddCircle from "../../../svgs/AddCircle"

const Entries:React.FC = () =>{
    const [posts, setPosts] = useState<any>([])
    const [zState, setZstate] = useState<any>([])
    const dispatch = useDispatch()
    const draggable_element_ref = useRef<HTMLDivElement>(null)
    const screen_ref = useRef<HTMLDivElement>(null)
    const currentPath  = useSelector<ScrlState,any>(state=>state.CurrentPathReducer.path)
    const refreshPosts = useSelector<ScrlState,any>(state=>state.RefreshPostsReducer.refresh)
    const {isLoading:postsLoading, isError:postsLoadingError, send_request:get_all_posts } = useHttp()
    const [emptyFolder, setEmptyFolder] = useState(false)
    const imageInputRef = useRef<HTMLInputElement>(null)
    const current_post_ref = useRef<any>(null)

   useEffect( ()=>{
    if(lastPath.reduce((total,e)=>total+e,"")!==currentPath.reduce((total:any,e:any)=>total+e,"")){
        load_posts()
        }
   },[currentPath])


   useEffect( ()=>{
    if(refreshPosts===true){
        load_posts()
        dispatch(Actions.reset_refresh()as any) 
    }
   },[refreshPosts])


   const addImage =()=>{
    if (imageInputRef!==null){
        imageInputRef.current?.click()
    }
}

   
   const [updated_post, set_updated_post] = useState<String>("")









    const load_posts = () =>{
       

        if(currentPath[0]!==""){
        setLastPath(currentPath)
        let key = localStorage.getItem("enc") as string
        
        const path:any={}
        currentPath.forEach((element:any,index:number) => {
            path[`q${index}`]=element
        });
    


        if(key!==undefined){

        const request_data={
            url:"http://localhost:3001/private-entries-api/allposts"+"?"+new URLSearchParams(path),
            method:"GET",
        }
        let decoded_posts:any=[]

        get_all_posts(request_data,async (data:any)=>{

            if(data.data.length===0){
                setEmptyFolder(true)
            }
            else{
                setEmptyFolder(false)
            }

            console.log(data.data)

            for(let i=0; i<data.data.length;i++){
                let element=data.data[i]
                let decoded_title =  await AES.decrypt(element.title,key).toString(utf8)
                let decoded_content = await AES.decrypt(element.content,key).toString(utf8)
                let decoded_language = await AES.decrypt(element.language,key).toString(utf8)
                let decoded_font_size = await AES.decrypt(element.font_size,key).toString(utf8)
                let date = element.date

                
                
                let decoded_images:any= []

                for (let j=0;j<element.images.length;j++){
                    let current_img = element.images[j]
                    let decoded_image_name= await AES.decrypt(current_img.image_name,key).toString(utf8)
                    let decoded_image_data= await AES.decrypt(current_img.image_data,key).toString(utf8)
                    let decoded_image={
                        image_name:decoded_image_name,
                        image_data:decoded_image_data
                    }
                    decoded_images.push(decoded_image)
                }
               
                let decoded_post = {
                    key:date,
                    date:date.split("T")[0],
                    title:decoded_title,
                    content:decoded_content,
                    language:decoded_language,
                    font_size:decoded_font_size,
                    images:decoded_images
                }

                decoded_posts.push(decoded_post)
            };
        })
       
        setPosts(decoded_posts)
        setZstate(decoded_posts)




    }
}
    }
   

   const [user_entries, set_user_entries ] = useState<any>([])
   
   const [enableDrag, setEnableDrag] = useState(false)

   const [gridMode,setGridMode] = useState(false)

   const [refresh, setRefresh] = useState(false)

   const getLeftBound = () =>{
       console.log(draggable_element_ref.current?.getBoundingClientRect().x)

   return draggable_element_ref.current?.getBoundingClientRect().x

   }
   const handleResize = () =>{
    setScreenWidth(window.innerWidth)
       
    if(posts.length*375>window.innerWidth){
        setGridMode(true)
        }
        else{
            if(gridMode===true)
            setGridMode(false)
        }
   }


   let [newSelectedImages,setSelectedImages]= useState<any>([])
   
   const handleNewFile = (event:any) =>{
    setSelectedImages((old: any)=>[...old, event.target.files[0]])
    console.log(newSelectedImages)
    }
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


       const insert = (arr:any, index:number, newItem:any) => [
        // part of the array before the specified index
        ...arr.slice(0, index),
        // inserted item
        newItem,
        // part of the array after the specified index
        ...arr.slice(index)
      ]

   const [refresh_posts, set_refresh] = useState(false)

   const handle_close = (key:any) =>{

    set_images_to_delete([])
    setSelectedImages([])


   }

   useEffect( ()=> {
     construct_new_images(newSelectedImages)
   },[newSelectedImages])

   const [new_image_objects, set_new_image_objects] = useState<any>([])
   const construct_new_images = async (images:any) =>{
    const new_image_objects = []
    for(let i=0; i<images.length;i++){

       let rez =await read_image(images[i])
       new_image_objects.push({
           image_name:images[i].name,
           image_data:rez
       })
   }
   set_new_image_objects(new_image_objects)
}

   const [images_to_delete, set_images_to_delete] = useState<any>([])

   const [lastPath, setLastPath]= useState([])
   useEffect(()=>{
    window.addEventListener("resize", handleResize, false);
   },[])


   const [screenWidth,setScreenWidth] = useState(window.innerWidth)






   
  
   const [selected_post, set_selected_post] = useState<String>("")

   const [selected_post_backup, set_selected_post_backup]=useState<any>(null)

   const expand_post = (key:String) =>{
       if(key!==selected_post && key!=="" && selected_post!==""){
          console.log(selected_post, key)
          alert("finish editing the previous post")
       }
       else
       set_selected_post(key)
       
     

   }
   const [selectedNote,setSelectedNode]=useState("")

    return (
    <div className=" h-fit mb-10 ">
    {postsLoading&&
    <div className="absolute w-full z-40 text-white flex justify-center bg-blue-400 h-8">
        Loading posts...
    </div>
    }
    {postsLoadingError&&
     <div className="absolute w-full z-40 text-white flex justify-center bg-red-600 h-8">
        Server error, please try again later...
    </div>
    }

    <div ref={screen_ref} className={` ${!gridMode?"flex w-screen p-8 pb-16 justify-center md:justify-start gap-8 flex-wrap":classes.entries}`}>
       {emptyFolder&&
       <div>This folder is empty...</div>
       }
       
       {
           posts.map((post:any,index:number)=>{

               return <div style={{
                minWidth:"375px",
                height:"fit-content",

                resize:"both",

               }} className="transition-all ease-in-out duration-500 cursor-pointer shadow-black hover:shadow-md" ><motion.div
               
               ref={post.key===selected_post?current_post_ref:null}
             
               key={index}
               className="shadow-md shadow-black "
               
               //drag={enableDrag}
               //dragConstraints={screen_ref}
               //dragMomentum={false}
               style={post.key!==selected_post?{
                   // zIndex:zState.indexOf(post),
                   // overflow: "auto",
                    height:"fit-content",
                   // maxWidth:"30vw",
    
                    maxWidth:screenWidth>=1024?screenWidth/2.25:"90vw",
               }:{
               /* zIndex:zState.indexOf(post),
                resize:"both",
                overflow: "auto",
                minWidth:"90vw",
                minHeight:"320px",
                maxHeight:"100vh",
                width:"90vw",*/
                //zIndex:zState.indexOf(post),
                 //resize:"both",
               // overflow: "auto",
                maxWidth:"100vw",
                minHeight:"150px",
                //maxWidth:screenWidth>=1024?screenWidth/2.25:"90vw",

               }} onMouseOver={()=>{
                setZstate((old:any)=>{
                    const old_data= old.filter( (e:any)=> e!==post)
                    old_data.push(post)
                    return old_data
                })
             }} >
                <Entry handle_close={handle_close} refresh={refresh_posts}  delete_images= {images_to_delete}  reset_submit = {()=>set_updated_post("")}
                  expand_post={expand_post} update_post={updated_post} currently_expanded_post={selected_post} font_size={post.font_size} language={post.language} title={post.title} date={post.date} key={post.key} images={post.images} new_images={new_image_objects} content={post.content} post_key={post.key} change_drag={setEnableDrag} >
                   
               </Entry>
              
               </motion.div>
               {(post.key===selected_post)&&
                    <div 
                    className={ `  flex gap-6 flex-wrap bg-porange text-white p-2 shadow-sm shadow-black   break-all `}
                    
                    style={{
                        //maxWidth:screenWidth>=1024?screenWidth/2.25:"90vw",
                       
                    }}>
               {post.images.map((image:any,index:any)=>{
                   if(images_to_delete.indexOf(image)===-1)
                   return <NewImage imageName={image.image_name} key={index} imageObject={image} removeImage={()=>{
                       set_images_to_delete((old:any)=>[...old,image])
                }}/>

               })}

              {newSelectedImages!==undefined&&newSelectedImages.map((image:any,index:any)=>{
                   return <NewImage isGreen={true} imageName={image.name} key={index} imageObject={image}  removeImage={()=>{
                       setSelectedImages((old:any)=>old.filter((img:any)=>img!==image))
                }}/>

               })}
                  <input className=" hidden" type="file" ref={imageInputRef} onChange={handleNewFile}> 
                   </input>

                {
                <AddCircle height={30} width={30}  onClick={addImage}>
                       
                </AddCircle>
                
                }
                </div>
                
                }
                {post.key===selected_post&&
                <div className=" bg-ppink p-1 text-black flex justify-center shadow-sm shadow-black hover:bg-porange hover:text-white cursor-pointer "  onClick={() => {
                    set_updated_post(selected_post)
                }}>
                    <button>
                        Save Changes
                    </button>
                </div>}
               </div>
           })
       }
    </div>
    </div>
    )
}

export default Entries