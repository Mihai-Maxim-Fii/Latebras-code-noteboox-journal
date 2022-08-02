import ModalWrapper from "../Utility/ModalWrapper";
import ExpandableInfo from "../Utility/ExpandableBar";
import { useState } from "react";
import useHttp from "../Hooks/useHttpRequest"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router"
interface RegisterInfo{
    username:string,
    public_username:string,
    password:string,
    close_modal:any
}
const RegMod:React.FC<RegisterInfo> = (props)=>{
    const [showPass, setShowPass] = useState(false)
    const toggleShowPass = ()=>{
        setShowPass(!showPass)
    }
    
const navigate = useNavigate()
    const {isLoading:loginLoading, isError:loginError, send_request:login_user } = useHttp()
    const dispatch = useDispatch()
    const log_after_register = ()=>{


        const login_oject={
            username:props.username,
            password:props.password
        }

        const new_request={
            url:"http://localhost:3001/user-api/login",
            method:"POST",
            body:login_oject
        }

        login_user(new_request,(data:any)=>{
            if (data.status==="nok"){
                //problem with login
            }
            else{
                console.log(data)
                dispatch({type:"LOGIN"})
                navigate("/entries",{replace:true})

            }
        })

    }
    return(
     <ModalWrapper>
    <div className=" mt-56 md:mt-52  w-96 h-fit rounded-sm shadow-pgray  shadow-lg flex flex-col bg-ppink justify-between ">
    <div className="w-full bg-porange flex justify-center text-white p-4">
    <p>Welcome to Latebras!</p>
    </div>
    <div className="w-full p-4 w-full bg-pgray text-ppink flex justify-center">
        <p>
            Your account has been created succesfully!
        </p>

    </div>
    <ExpandableInfo  title={"Account Credentials"}  width={"w-96"} bgcolor={"bg-pgray"} txtcolor="text-white p-4" titlepoz={""}>          
    <div className="flex flex-col items-center  pb-6 ">
    <div className="flex justify-between w-full gap-2 bg-white p-2  w-11/12">
          <div className="w-1/2 text-black ">
          <p className="flex justify-end " >
          Public Username:
          </p>
          </div>
          <p className="w-1/2 text-porange"> 
           {props.public_username}
          </p>
      </div>
      <div className="flex justify-between w-full gap-2 bg-white p-2  w-11/12">
          <div className="w-1/2   ">
          <p className="flex justify-end text-black">
          Username:
          </p>
          </div>
          <p className="w-1/2 text-porange"> 
           {props.username}
          </p>
      </div>
      {!showPass?
          <button className="bg-white text-black px-2 py-1 rounded-sm hover:bg-yellow-400 hover:text-white w-11/12 " onClick={toggleShowPass}>
              Show Password
          </button>:
          <div className="flex justify-between w-full gap-2 bg-white p-2  w-11/12">
          <div className="w-1/2   ">
          <p className="flex justify-end text-black">
          Password:
          </p>
          </div>
          <p className="w-1/2 text-porange"> 
           {props.password}
          </p>
      </div>

        }
      
    
    </div>
    </ExpandableInfo>
    <div className="flex justify-end gap-2 p-2">
        <button className="bg-pgray px-4 py-2 rounded-md text-white hover:bg-porange" onClick={log_after_register}>
            Log me in
        </button>
        <button className="bg-pgray px-4 py-2 rounded-md text-white hover:bg-porange" onClick={props.close_modal}>
           Close
        </button>
    </div>
    </div>
    </ModalWrapper>)
}

export default RegMod
