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
       
    if(posts.length*320>window.innerWidth){
        setGridMode(true)
        }
        else{
            if(gridMode===true)
            setGridMode(false)
        }
   }

   const [lastPath, setLastPath]= useState([])
   useEffect(()=>{
    window.addEventListener("resize", handleResize, false);
   },[])


   const [screenWidth,setScreenWidth] = useState(window.innerWidth)






   
  

   const [selectedNote,setSelectedNode]=useState("")

    return (
    <div className=" h-fit mb-10">
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

               return <motion.div



               ref={draggable_element_ref}
               whileHover={
                {
                    boxShadow: "0px 2px 8px 6px rgb(0,0,0,0.3)",

                }
            }
              
               key={index}
               
               //drag={enableDrag}
               //dragConstraints={screen_ref}
               //dragMomentum={false}
               style={{
                    zIndex:zState.indexOf(post),
                    resize:"both",
                    overflow: "auto",
                    height:"fit-content",
                    minWidth:"320px",
                    maxWidth:screenWidth>=1024?screenWidth/2.25:screenWidth,

    
                    boxShadow: "0px 2px 2px 2px rgb(0,0,0,0.3)",
               }} onMouseOver={()=>{
                setZstate((old:any)=>{
                    const old_data= old.filter( (e:any)=> e!==post)
                    old_data.push(post)
                    return old_data
                })
             }} >
                <Entry font_size={post.font_size} language={post.language} title={post.title} date={post.date} key={index} images={post.images} content={post.content} change_drag={setEnableDrag} >
                   
               </Entry>
               </motion.div>
           })
       }
    </div>
    </div>
    )
}

export default Entries