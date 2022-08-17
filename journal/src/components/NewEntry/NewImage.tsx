import CloseCircle from "../../svgs/CloseCircle"
interface ImageProps{
    imageObject:any,
    imageName:string,
    removeImage:any,
    isGreen?:boolean
}


const NewImage:React.FC<ImageProps> = (props) =>{
    const remove = ()=>{
        props.removeImage(props.imageObject)
    }
    return (
        <div className="flex gap-1 items-center  ">
            <div className={`${props.isGreen!==undefined?" text-green-500":""}`}>
                <CloseCircle className=" hover:scale-125 hover:cursor-pointer" width={20} height={20} onClick={remove}></CloseCircle>
            </div>
            <div className={`${props.isGreen!==undefined?" text-green-500":""}  `}>
                {props.imageName}
            </div>
            
        </div>
    )
}

export default NewImage