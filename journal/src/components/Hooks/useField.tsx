import { useState } from "react"
interface ValidationFunction{
    vfnc: Function,
  
}

interface ValidationReturn {
    inputValue:string,
    inputTouched:boolean,
    inputValid:string,
    onChangeHandler:any,
    onFocusHandler:any,
    onBlurHandler:any,
}

function UseValidateField(props:ValidationFunction):ValidationReturn{
    const [inputValue,setInputValue] = useState<string>("")
    const [inputTouched, setInputTouched] = useState(false)
    const [inputValid, setInputValid] = useState(props.vfnc(""))
    const onChangeHandler = (event:any)=>{
        setInputValue(event.target.value)
        validateInput(event.target.value)

    }

    const onBlurHandler = (event:any)=>{
        setInputTouched(true)
        try{
        validateInput(event.target.value)
        }
        catch {

        }
    }

    const validateInput =(value:string)=>{
        setInputValid(props.vfnc(value))
    }

    const onFocusHandler = (event:any)=>{
        setInputTouched(false)
    }

    const returnObject:ValidationReturn={
        inputValue,
        inputTouched,
        inputValid,
        onChangeHandler,
        onFocusHandler,
        onBlurHandler,
    }
   return (returnObject)
}

export default UseValidateField