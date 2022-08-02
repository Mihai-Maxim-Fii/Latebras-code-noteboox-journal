import { useState } from "react"
import { json } from "stream/consumers"
import axios from "axios"
import { useDispatch } from "react-redux"
export interface RequestInfo{
    url:string,
    method:"POST"|"GET"
    headers?:{},
    body?:{},

    
}

export interface RequestHttpHook{
    isLoading:boolean,
    isError:boolean,
    send_request:any

}


function useHttp():RequestHttpHook{

    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    
    const dispatch = useDispatch()

    const handle_data = (data:any, resolve:any)=>{
        /*
        if(data.logout!==undefined){
        if(!data.logout){
        resolve(data)}
        else{
        dispatch({type:"LOGOUT"})
        }
       }
       else{
           resolve(data)
       }
       */
      resolve(data)
    }

    const send_request = async (request:RequestInfo, resolve:(data:any)=>{})=>{
       //console.log(request.body)
        setIsLoading(true)

    

        try{
        if (request.method==="POST"){
        const response=await axios.post(request.url, request.body,{ withCredentials: true })
        const data = response.data

        handle_data(data,resolve)
        }
        else if (request.method==="GET"){
        const response=await axios.get(request.url,{ withCredentials: true })
        const data = response.data
        handle_data(data,resolve)
        }
        else if (request.method==="PUT"){
        const response=await axios.put(request.url,{ withCredentials: true })
        const data = response.data
        handle_data(data,resolve)
        }
        

    
        setIsLoading(false)
        setIsError(false)
       }
       catch(err){
           console.log(err)
           setIsError(true)
           setIsLoading(false)
       }



    }
   return {
       isLoading,
       isError,
       send_request
   }
}

export default useHttp