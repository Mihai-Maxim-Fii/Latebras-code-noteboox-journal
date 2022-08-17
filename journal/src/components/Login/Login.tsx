import ArrowDownIcon from "../../svgs/DownArrow"
import ArrowsAngleContractIcon from "../../svgs/UpArrow"
import { useEffect, useState } from "react"
import ExpandableInfo from "../Utility/ExpandableBar"
import UseValidateField from "../Hooks/useField"
import useHttp from "../Hooks/useHttpRequest"
import { RequestInfo } from "../Hooks/useHttpRequest"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router"
import Actions from "../Actions/Actions"
const Login:React.FC =()=>{

    const [showInfo, setShowInfo] = useState(false)
    
    const [showNews, setShowNews] = useState(false)

    const dispatch = useDispatch()
    
    const navigate = useNavigate()
    

    const {inputValue:usernameInputValue,
        inputTouched:usernameInputTouched,
        inputValid:usernameInputValid,
        onChangeHandler:usernameOnChangeHandler,
        onFocusHandler:usernameOnFocusHandler,
        onBlurHandler:usernameOnBlurHandler} = UseValidateField({
       vfnc:(input:string)=>{
          if(input.length===0){
              return "Username and Password cannot be empty!"
          }
          return ""
       }
   })


   const {inputValue:passwordInputValue,
    inputTouched:passwordInputTouched,
    inputValid:passwordInputValid,
    onChangeHandler:passwordOnChangeHandler,
    onFocusHandler:passwordOnFocusHandler,
    onBlurHandler:passwordOnBlurHandler} = UseValidateField({
   vfnc:(input:string)=>{
      if(input.length===0){
        return "Username and Password cannot be empty!"
      }
      
      return ""
   }
})


   

   let usernameInvalid = usernameInputTouched===true && usernameInputValid!==""
   
   let passwordInvalid = passwordInputTouched===true && passwordInputValid!==""

   useEffect(()=>{

    setInvalidLogin("")

   },[usernameInputValue,passwordInputValue])


   const {isLoading:loginLoading, isError:loginError, send_request:login_user } = useHttp()

   const [invalidLogin, setInvalidLogin] = useState("")

   const LoginUser = () =>{
        if(usernameInputValid ==="" && passwordInputValid===""){

            const login_oject={
                username:usernameInputValue,
                password:passwordInputValue
            }

            const new_request:RequestInfo={
                url:"http://localhost:3001/user-api/login",
                method:"POST",
                body:login_oject
            }
            login_user(new_request,(data:any)=>{
                if (data.status==="nok"){
                    setInvalidLogin(data.msg)
                    
                }
                else{
                    
                    localStorage.setItem("enc",login_oject.username)
                    dispatch({type:"LOGIN"})
                    dispatch(Actions.fetch_post_tree() as any)
                    navigate("/entries",{replace:true})

                }
            })

        }
        else{
            passwordOnBlurHandler(passwordInputValue)
            usernameOnBlurHandler(usernameInputValue)
        }
            
   }



    return (
    <div className="flex mt-8 justify-center ">
    <div className="flex items-center p-6 flex-col ">
    <div className="w-full bg-pgray text-white p-4 flex justify-center">
        <p>Welcome Back</p>
    </div>
       
        <div className="shadow-sm  ">
              <div className="bg-porange text-white w-96  p-4 flex justify-around shadow-sm shadow-black ">
                  <label className=" w-1/4 " htmlFor="username">Username:</label>
                  <input className={` rounded-sm  w-3/4  text-black shadow-sm shadow-black p-1 ${(usernameInvalid)?"bg-red-200":""}` } onChange={usernameOnChangeHandler} onBlur={usernameOnBlurHandler} onFocus={usernameOnFocusHandler} type="text"></input>
              </div>
              <div className="bg-porange text-white w-96  p-4 flex justify-around shadow-sm shadow-black  ">
                  <label className=" w-1/4" htmlFor="username">Password:</label>
                  <input className={` rounded-sm  w-3/4  text-black shadow-sm shadow-black p-1 ${(passwordInvalid)?"bg-red-200":""}` } onChange={passwordOnChangeHandler} onBlur={passwordOnBlurHandler} onFocus={passwordOnFocusHandler} type="password"></input>
              </div>
          </div>
          <div className={`flex w-96  ${!(usernameInvalid || passwordInvalid )?"":""}`}>
              <button className="bg-porange text-white text-center rounded-sm shadow-sm shadow-black px-6 py-2 mt-2 hover:bg-pgray h-fit" onClick={LoginUser}>
                  Login
              </button>
              <div className="p-2 self-center">
              {(usernameInvalid || passwordInvalid )?
                      <div className="flex flex-start w-full ">
                      <p className=" text-red-700 ">
                        {usernameInputValid!==""? usernameInputValid:
                        passwordInputValid!==""&&passwordInputValid}
                      </p>
                      </div>:invalidLogin!==""?<p className=" text-red-700 ">{invalidLogin}</p>:
                       loginLoading?<p className=" text-red-700">Logging in....</p>:loginError&&<p className=" text-red-700">Something went wrong, server error.</p>
                }

              </div>
          </div>
             
           
    
    </div>
    
    </div>)
}
export default Login