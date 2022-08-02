export interface FeatureInfo {
    png:string,
    title:string,
    description:string,
}
const Feature:React.FC<FeatureInfo> = (props) =>{
    return (
        <div className="p-3 md:w-1/2 flex-col self-center ">
         <div className="flex justify-center">
             <img  src={props.png} style={{
                 width:"200px",
                 height:"200px"
             }} alt={props.title}></img>
         </div>
         <div className="flex justify-center mb-3">
             <p>
                 {props.title}
             </p>
         </div>
         <div>
             <p className=" ">
                 {props.description}
             </p>
         </div>
        </div>
    )
}

export default Feature