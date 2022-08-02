import { hover } from "@testing-library/user-event/dist/hover"
import ModalWrapper from "../../Utility/ModalWrapper"
import { useState, useEffect, useRef, useMemo } from "react"
import Carousel from "./Carousel"
import { motion } from "framer-motion"
interface ImageData{
    images:any,
    close:any
}

const EntryImageViewer:React.FC<ImageData> = (props) =>{

    const [currentIndex,setCurrentIndex]= useState(props.images[0].image_data)
    const create_image_array=()=>{
        let images:any=[]
        props.images.forEach((img_object:any)=>{
            images.push(img_object.image_data)
        })
        return images
    }

    const carousel_ref = useRef<any>()

    

    let images_array=useMemo(()=>create_image_array(),[props])

    const imagesNumber = props.images.length

    const [nextMode,setNextMode] = useState(false)
 

    const nextImage = () =>{
        setNextMode(true)
        if(carousel_ref.current!==undefined ){
        carousel_ref.current.next()
        } 
    }

    const lastImage = () =>{
        setNextMode(false)
        if(carousel_ref.current!==undefined )
           carousel_ref.current.back()

    }
    return(

        <ModalWrapper>
       
        <div className=" grid grid-rows-6 w-10/12 overflow-x-hidden  " >
        
            
            <div className="  row-start-2 row-span-4 flex flex-col justify-center items-center mb-24 ">
              
            

             <motion.img 
             initial={
                 {
                     
                     x:!nextMode?"-100vw":"100vw"
                 }
             }
             animate={
                 {
                     x:0,
                 }
             }
             transition={
                 {
                     type:"tween",
                     duration:0.2
                 }
             }
             
             
             
             src={currentIndex} key={currentIndex} style={
                 {
                     maxHeight:"100%"
                 }
             } >
             </motion.img>
             <motion.button 
             whileHover={{
                 scale:1.1,
                 boxShadow:"0px 2px 8px 2px rgb(0,0,0,0.3)"
                 
             }}
             whileTap={{
                 scale:0.9
             }}
             
             className="px-6 py-1 mt-2 z-20 bg-pgray  text-white rounded-sm" onClick={props.close}
             >
                Close
            </motion.button>
            <div className=" bg-black absolute  top-0 left-0 h-full w-1/12 opacity-30 z-10 hover:bg-white  cursor-pointer " onClick={lastImage} style={{
            maxWidth:"5rem",
            height:"87.7%"

                }} >
           </div>

        <div className=" bg-black absolute top-0 right-0 h-full w-1/12 opacity-30  z-10 hover:bg-white cursor-pointer  " onClick={nextImage} style={{
            maxWidth:"5rem",
            height:"87.7%"
        }}>

        

        </div>
            
             </div>
            
            
           
             
             
            <div className=" row-start-6  h-full absolute  left-0  w-screen ">

                <div className="h-full flex flex-col justify-end ">
                    <div className=" bg-pgray h-16 text-white flex  items-center justify-center gap-2 ">
                         <Carousel set_index={setCurrentIndex} ref={carousel_ref} items={images_array}></Carousel>
                        
                    </div>

                </div>
            </div>
            </div>
            
        </ModalWrapper>
    )
}

export default EntryImageViewer