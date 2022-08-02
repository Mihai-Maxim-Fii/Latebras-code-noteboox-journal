import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { json } from "stream/consumers"
import UseValidateField from "../Hooks/useField"
import useHttp from "../Hooks/useHttpRequest"
import { RequestInfo } from "../Hooks/useHttpRequest"
import RegMod from "./ModalRegister"
const Register:React.FC = ()=>{
    useEffect(() => {
        window.scrollTo(0,0)
    }, [])



   const {inputValue:passwordInputValue,
         inputTouched:passwordInputTouched,
         inputValid:passwordInputValid,
         onChangeHandler:passwordOnChangeHandler,
         onFocusHandler:passwordOnFocusHandler,
         onBlurHandler:passwordOnBlurHandler} = UseValidateField({
        vfnc:(input:string)=>{
           if(input.length===0){
               return "Password cannot be empty!"
           }
           else
           if (input.length<10 || input.length>25){
            return "Password must be between 10 and 25 characters long."
            }
            else
            {
           return ""
            }
        }
    })


    const {inputValue:usernameInputValue,
        inputTouched:usernameInputTouched,
        inputValid:usernameInputValid,
        onChangeHandler:usernameOnChangeHandler,
        onFocusHandler:usernameOnFocusHandler,
        onBlurHandler:usernameOnBlurHandler} = UseValidateField({
       vfnc:(input:string)=>{
          if(input.length===0){
              return "Username cannot be empty!"
          }
          else
          if (input.length<6 || input.length>20){
           return "Username must be between 6 and 20 characters long."
           }
           else
           {
          return ""
           }
       }
   })

   const {inputValue:publicUsernameInputValue,
    inputTouched:publicUsernameInputTouched,
    inputValid:publicUsernameInputValid,
    onChangeHandler:publicUsernameOnChangeHandler,
    onFocusHandler:publicUsernameOnFocusHandler,
    onBlurHandler:publicUsernameOnBlurHandler} = UseValidateField({
   vfnc:(input:string)=>{
      if(input.length===0){
          return "Public Username cannot be empty!"
      }
      else
      if (input.length<6 || input.length>20){
       return "Public Username must be between 6 and 20 characters long."
       }
       else
       {
      return ""
       }
   }
})



    let passwordInvalid = passwordInputTouched===true && passwordInputValid!==""
    let usernameInvalid = usernameInputTouched===true && usernameInputValid!==""
    let publicUsernameInvalid = publicUsernameInputTouched===true && publicUsernameInputValid!==""

    interface RegisterInfo{
        username:string,
        public_username:string,
        password:string
    }

    const [serverError, setServerError] = useState("")

    const {isLoading:registerLoading, isError:registerError, send_request:register_user } = useHttp()

    const [showRegisterModal, setShowRegiserModal] = useState(false)
   

    const closeModal=()=>{
        setShowRegiserModal(false)
    }

    const RegisterUser=(event:any)=>{
        event.preventDefault()
        setServerError("")


        if (passwordInputValid==="" && usernameInputValid==="" && publicUsernameInputValid==="")
        {
            const register_oject:RegisterInfo={
                username:usernameInputValue,
                public_username:publicUsernameInputValue,
                password:passwordInputValue
            }

            const new_request:RequestInfo={
                url:"http://localhost:3001/user-api/register",
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:register_oject
            }
            register_user(new_request,(data:any)=>{
                if(data.status==="nok"){
                    setServerError(data.msg)
                }
                else{
                    setShowRegiserModal(true)
                }
            })
        }
        else{
         passwordOnBlurHandler(passwordInputValue)
         usernameOnBlurHandler(usernameInputValue)
         publicUsernameOnBlurHandler(publicUsernameInputValue)
        }
     }
    
    return (
        <div>
    {showRegisterModal&&
      <RegMod username={usernameInputValue} password={passwordInputValue} public_username={publicUsernameInputValue} close_modal={closeModal}></RegMod>
    }
    
    <div className="p-6 mb-10">
    
    <div className="grid grid-cols-1 grid-rows-1 gap-3 md:grid-cols-2">

        <div className="flex items-center md:items-end flex-col">
        <div className="flex  justify-center items-center text-white w-96  ">
            <div className=" bg-pgray p-6 mb-2 ">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas eos rem veniam pariatur necessitatibus laborum, totam mollitia ipsam ea. Dolor sequi laudantium tempora quisquam sunt! Laboriosam qui maxime assumenda laborum?
            </div>
        </div>

        <form className=" flex items-center flex-col basis-full justify-center w-96">
            
              <div className=" bg-porange  p-3 text-white shadow-black shadow-sm flex w-96  justify-between  ">

                <label htmlFor="user" >Username:</label>
                <input id="user" type="text" className={` text-black rounded-sm shadow-black shadow-sm w-7/12 p-1 ${(usernameInvalid)?"bg-red-200":""} `} onChange={usernameOnChangeHandler} onBlur={usernameOnBlurHandler} onFocus={usernameOnFocusHandler} />
            
              </div>

              <div className=" bg-porange  p-3 text-white shadow-black shadow-sm flex w-96  justify-between ">

                <label htmlFor="public-user" >Public Username:</label>
                <input id="public-user" type="text" className={` text-black rounded-sm shadow-black shadow-sm w-7/12 p-1 ${(publicUsernameInvalid)?"bg-red-200":""} `} onBlur={publicUsernameOnBlurHandler} onChange={publicUsernameOnChangeHandler} onFocus={publicUsernameOnFocusHandler}/>
            
              </div>

              <div className=" bg-porange  p-3 text-white shadow-black shadow-sm flex w-96  justify-between ">

                <label htmlFor="password" >Password:</label>
                <input id="password" type="password" className={` text-black rounded-sm shadow-black shadow-sm w-7/12 p-1 ${(passwordInvalid)?"bg-red-200":""} `} onBlur={passwordOnBlurHandler} onChange={passwordOnChangeHandler} onFocus={passwordOnFocusHandler}/>
            
              </div>
              <div className="flex flex-start w-96 mt-2 gap-8">
                  <button className="bg-porange p-2 w-24  self-start  rounded-lg  shadow-black shadow-sm text-white  hover:bg-pgray" onClick={RegisterUser}>
                      Register
                  </button>
                  <ul className="flex items-center flex-col gap-2 list-decimal">
                  {usernameInvalid&&
                      <li className="flex flex-start w-full ">
                      <p className=" text-red-700 ">
                        {usernameInputValid}
                      </p>
                      </li>
                        }

                        
                       {publicUsernameInvalid&&
                      <li className="flex flex-start w-full ">
                      <p className=" text-red-700 ">
                        {publicUsernameInputValid}
                      </p>
                      </li>
                        }

                      {passwordInvalid&&
                      <li className="flex flex-start w-full  ">
                      <p className=" text-red-700">
                        {passwordInputValid}
                      </p>
                      </li>
                        }


                    {serverError!==""&&
                      <li className="flex flex-start w-full ">
                      <p className=" text-red-700 ">
                        {serverError}
                      </p>
                      </li>
                        }


                     {registerLoading&&
                     <li className="flex flex-start w-full ">
                     <p className=" text-porange">
                          Creating account...</p></li>}

                          {registerError&&
                          <li className="flex flex-start w-full ">
                          <p className="text-red-700">
                          Something went wrong, server error...</p>
                          </li>}

                  </ul>
              </div>
              
              
        </form>
        </div>
        <div className=" text-white flex  justify-center row-start-2   md:justify-start md:col-start-2 md:row-start-1  ">
            <div className=" w-96 bg-pgray p-6 shadow-black shadow-sm ">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius magnam officiis nobis vero fuga dolores, at inventore molestiae omnis numquam laborum odit fugit repudiandae. Similique eligendi laudantium molestiae laboriosam cupiditate?
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsum nobis, illo animi alias quis quae. Porro odio inventore eius voluptate, eveniet tempore. Fugiat corrupti beatae sunt quos, inventore porro expedita?
            </div>
        </div>

       
        
 
    </div>
    <div className=" md:col-span-2 flex justify-center mt-2">
            <div className=" w-96 md:w-w-192 bg-ppink h-fit  text-black p-4 border-gray-100 border ">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore illum alias repellendus! Quia eum repellendus ad error iusto cumque accusantium quod vel. Perferendis recusandae cupiditate aspernatur et, illum debitis ex.
            </div>
        </div>

    </div>

    </div>
    )
}

export default Register