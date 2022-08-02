import CloseCircle from "../../svgs/CloseCircle"
interface ImageProps{
    imageObject:any,
    imageName:string,
    removeImage:any
}


const NewImage:React.FC<ImageProps> = (props) =>{
    const remove = ()=>{
        props.removeImage(props.imageObject)
    }
    return (
        <div className="flex gap-1 items-center">
            <div className="">
                <CloseCircle className=" hover:text-red-500 hover:cursor-pointer" width={20} height={20} onClick={remove}></CloseCircle>
            </div>
            <div>
                {props.imageName}
            </div>
            
        </div>
    )
}

export default NewImage