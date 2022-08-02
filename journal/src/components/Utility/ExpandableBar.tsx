import { useState } from "react"
import ArrowDownIcon from "../../svgs/DownArrow"
import ArrowsAngleContractIcon from "../../svgs/UpArrow"
interface InfoProps{
    title:string,
    content?:string,
    width:string,
    bgcolor:string,
    txtcolor:string,
    titlepoz:string,
    children:any,
    order?:string
}
const ExpandableInfo:React.FC<InfoProps>= (props)=>{
    const [showInfo,setShowInfo] = useState(false)
    function toggleShowInfo(){
        setShowInfo(!showInfo)
    }

    const wrapper_cls= "shadow-sm shadow-black "
    const title_cls= `flex justify-between  cursor-pointer ${props.width} ${props.bgcolor} ${props.txtcolor} ${props.titlepoz}`
    const content_cls= `${props.bgcolor} ${props.txtcolor} ${props.width}`
    return(
        <div className={wrapper_cls}>
        <div className={title_cls} onClick={toggleShowInfo}>
            <p className={props.order}>
            {props.title}
            </p>

            {showInfo==false?
        <div className=" " >
          <ArrowDownIcon></ArrowDownIcon>
        </div>:
        <div className=" ">
          <ArrowsAngleContractIcon></ArrowsAngleContractIcon>
        </div>
      }
      
        </div>
        {showInfo&&
        <div className={content_cls}>
            {props.content}
            {props.children}
        </div>
          }
          </div>
    )
}

export default ExpandableInfo