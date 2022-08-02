import classes from "./ModalWrapper.module.css"
import ReactDOM from "react-dom"
interface ModalWrapperProps{
    children:any
}
const ModalWrapper:React.FC<ModalWrapperProps> = (props)=>{
    return ReactDOM.createPortal(
        <div className={classes.modal}>
            {props.children}
        </div>
        ,document.getElementById("root") as HTMLElement
    )
}
export default ModalWrapper