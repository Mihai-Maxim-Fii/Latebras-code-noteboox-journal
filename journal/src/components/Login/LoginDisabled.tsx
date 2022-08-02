import { useEffect } from "react"
import ModalWrapper from "../Utility/ModalWrapper"
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import axios from "axios";
export const LoginDisabled:React.FC = ()=>{
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const goHome=()=>{
    navigate("/home",{replace:true})
   }
   const logout=async ()=>{
     console.log("aici")
     const response = await axios.put("http://localhost:3001/user-api/logout",{ withCredentials: true })
     dispatch({type:"LOGOUT"})
     navigate("/home",{replace:true})}
    return(<ModalWrapper>
        <div className=" flex justify-center items-center">
            <div className="  w-80 h-80 bg-pgray rounded-md p-6 flex flex-col items-center justify-between">
                <p className=" text-ppink  ">
                    You are already logged in!
                </p>
                <div className="flex self-end gap-6">
            
               <button className=" bg-porange text-white px-4 py-3 rounded-md hover:bg-blue-500" onClick={goHome}>
                   Home
               </button>
               <button className=" bg-white text-black px-4 py-3 rounded-md hover:bg-blue-500 hover:text-white" onClick={logout}>
                    Logout
                </button>
                </div>
            </div>
        </div>
    </ModalWrapper>)
}