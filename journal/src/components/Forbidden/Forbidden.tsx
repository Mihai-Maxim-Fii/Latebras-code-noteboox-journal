import { motion } from "framer-motion"
import { useNavigate } from "react-router"
const Forbidden:React.FC =() =>{

    const navigate = useNavigate()
    return(<div style={{
        display:"grid",
        backgroundColor:"rgb(246 233 233)",
        gridTemplateColumns:window.innerWidth>=768?"1fr 5fr 1fr":"1fr 6fr 1fr",
        gridTemplateRows:"100vh"
    }}>
        <motion.div

        initial={{
            width:0,
            
        }}

        animate={{
            width:"100%"
        }}

        transition={{
            duration:0.25
        }}
        
        
        
        className= "bg-ppink md:bg-pgray ">
              
        </motion.div>
        <div className=" bg-ppink flex justify-center items-center">
            <motion.div
              initial={{
                marginTop:-1000,
                
            }}
    
            animate={{
                marginTop:0
            }}
    
            transition={{
                duration:0.25
            }}
            
            
            className=" bg-pgray  h-1/2  w-80  md:w-5/6 rounded-md shadow-black shadow-md flex flex-col md:text-xl" >

                <div className=" bg-porange p-4 flex justify-center text-ppink font-semibold">
                    Access denied, you are not logged in!
                    
                </div>
                <div className="flex flex-col  h-3/4   ">
                    <div className="w-full  h-full flex  items-center justify-start px-4   ">
                    <p className="  text-ppink text-lg md:text-xl">
                    Your are trying to access a protected route...
                    </p>
                    </div>
                    <div className=" w-full  h-full flex  items-center  justify-end px-6">
                    <div className="  text-ppink flex  text-lg md:text-xl">
                    Please {<p onClick={()=>navigate("/login",{replace:true})} className="mx-2 text-porange cursor-pointer transition-all duration-500 hover:scale-110">Login</p>} first and try again!
                    </div>
                    </div>
                </div>

            </motion.div>

        </div>
        <div className="bg-pgray w-0 md:w-full ">
        <motion.div
          initial={{
            width:"100%",
            backgroundColor:"rgb(246 233 233)"
            
        }}

        animate={{
           width:"0%"
        }}

        transition={{
            duration:0.25
        }}
      
        
        className=" w-full h-full    ">
    


        </motion.div>
        </div>
        
    </div>)
}

export default Forbidden