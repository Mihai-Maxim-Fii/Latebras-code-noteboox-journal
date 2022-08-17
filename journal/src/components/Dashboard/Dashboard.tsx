import Hamburger from "hamburger-react"
import { useEffect, useRef, useState } from "react"
import useHttp from "../Hooks/useHttpRequest"
import { useDispatch } from "react-redux"
import { Outlet, useNavigate } from "react-router"
import ModalWrapper from "../Utility/ModalWrapper"
import ModalWrapperBlack from "../Utility/ModalWrapperBlack"
import NewEntry from "../NewEntry/NewEntry"
import FileSystem from "./FileSystem/FileSystem"
import { ScrlState } from "../Store/Store"
import axios from "axios"
import { motion } from "framer-motion"
import { useSelector } from "react-redux"
import LeftArrow from "../../svgs/LeftArrow"
import actions from "../Actions/Actions"
import RightArrow from "../../svgs/RightArrow"
import Actions from "../Actions/Actions"

const Dashboard:React.FC = () =>{
    const {isLoading:loginLoading, isError:loginError, send_request:logout_user } = useHttp()
    
    const loggedState = useSelector<ScrlState,any>(state=>state.loginReducer)
    const treeState =  useSelector<ScrlState,any>(state=>state.FolderTreeReducer)
    const currentPath = useSelector<ScrlState,any>(state=> state.CurrentPathReducer.normal_path)
    const [showMenu, setShowMenu] = useState(false)
    const current_path_ref = useRef<HTMLDivElement>(null)
    const [current_path_width,set_current_path_width] = useState(current_path_ref.current?.scrollWidth)
    const [showCurrentPath, setShowCurrentPath] = useState(true)
    const [showNewEntry, setShowNewEntry] = useState(false)
    const dispatch = useDispatch()
    const [showDirectories, setShowDirectories] = useState(false)
    const navigate = useNavigate()
    const toggleMenu = ()=>{
        setShowMenu(!showMenu)
    }

    useEffect( ()=>{

        if(isOverflown(current_path_ref.current)){
            setShowCurrentPath(false)
        }
        else{
            setShowCurrentPath(true)
        }

    },[currentPath])

    function isOverflown(element:any) {
        if(element===null) return true
        return  element.scrollWidth > element.clientWidth
      }


    



      const handleResize = () =>{
        if(current_path_ref!==undefined){

        if(isOverflown(current_path_ref.current)){
            setShowCurrentPath(false)
        }
        else{
            setShowCurrentPath(true)
        }
    }
       }
    
       useEffect(()=>{
        window.addEventListener("resize", handleResize, false);
       },[])


    useEffect( ()=>{
        dispatch(actions.fetch_post_tree() as any)
          },[])

    const logout = ()=>{
        const new_request={
            url:"http://localhost:3001/user-api/logout",
            method:"GET",
            headers:{"Content-Type":"application/json"},
        }
       logout_user(new_request,(data:any)=>{
            //console.log(data.status)
        })
        
        navigate("/login",{replace:true})
    }
    const toggleShowNewEntry = ()=>{
        setShowNewEntry(!showNewEntry)
    }

    const newEntry=()=>{
       // setShowMenu(false)
        setShowNewEntry(true)

    }



    
    return (
    <div
    
    style={{
        height:"100%",
        position:"relative",
        overflow:"hidden"
        
    }} >
     <div className="bg-pgray h-12 text-white flex justify-between items-center    ">

     <div className={`p-4 cursor-pointer ${showMenu?"underline":""} `} onClick={()=>setShowMenu(old=>!old)}>Options</div>

     <div className={`w-full   p-2 text-ppink h-full rounded-md flex items-center justify-center overflow-auto ${!showCurrentPath?" -z-50":""}`}  ref={current_path_ref}>
     {
     currentPath.map((p:any)=>{
        

         return p.split("#")[1]+"/"
     })
     
     }
     </div>
    

     < motion.div  
      className="  text-white flex justify-center h-12  z-50"   >
         <motion.button  onClick={()=>setShowDirectories(old=>!old)}
         animate={{
            width:showDirectories?250:150
        }}
        transition={{
            type:"tween"
        }}
         className=" w-1.5 py-2 bg-porange  cursor-pointer h-full     " >
             <div className={` flex  ${!showDirectories?"flex justify-around":" grid grid-cols-3"}`}>
            {!showDirectories?
             <motion.div ><LeftArrow></LeftArrow></motion.div>:<motion.div className=" ml-2"><RightArrow></RightArrow></motion.div>
            }
             <p  className={`${!showDirectories?"mr-5":""}`}>
             Directories
             </p>
             </div>
         </motion.button>
         <motion.div className=" ml-16 top-12  absolute right-0  overflow-y-auto h-full bg-pgray " 
            initial={{
             right:-500


            }}
            animate={{
                right:showDirectories?0:-500
            }}

            transition={{
                duration:0.25
            }}
     >

         {treeState.length!==0&&
         <FileSystem></FileSystem>
        }
     </motion.div>
     </motion.div>


     </div>
     {showMenu&&
     <motion.div   
     initial={{
        height:0
    }}

    animate={{
        height:32
    }}

    transition={{
        duration:0.25
    }}
    
     
     className=" bg-ppink text-black h-8 flex w-full  relative " style={{
         paddingBottom:"0.1rem"
     }}
     >
        <motion.div className="flex h-fit  absolute  "
        initial={{
            left:-500
        }}

        animate={{
            left:0
        }}

        transition={{
            duration:0.25
        }}
        
        
        
        >

            <motion.button

            whileHover={{
                paddingLeft:"25px",
                paddingRight:"25px"
            }}
            
            
            className="bg-porange h-full px-4 py-1 text-white " onClick={logout}>
                Logout
            </motion.button>
            <motion.button
             whileHover={{
                paddingLeft:"25px",
                paddingRight:"25px"
            }}
            
            
            
            className=" h-full px-4 py-1 text-black" onClick={()=>{
                dispatch(Actions.refresh_posts() as any)
            }}>
                Reload
            </motion.button>
            <motion.button
             whileHover={{
                paddingLeft:"25px",
                paddingRight:"25px"
            }}
            
            
            className="bg-yellow-400 h-full px-4 py-1 text-pink-600 " onClick={newEntry}>
                New Entry
            </motion.button>
            
        </motion.div>
     </motion.div>
}
     <div className=" flex h-full ">
    


     {showNewEntry&&
     <ModalWrapperBlack>
        <NewEntry closeModal={toggleShowNewEntry}/>
    </ModalWrapperBlack>
        }
    

    <div className= {`transition-all  h-full  overflow-x-hidden  overflow-y-auto `}>
    <Outlet></Outlet>

    </div>
    </div>
    </div>
    
    )
}

export default Dashboard