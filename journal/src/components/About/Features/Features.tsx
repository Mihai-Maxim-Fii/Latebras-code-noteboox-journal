import { FeatureInfo } from "./Feature"
import Feature from "./Feature"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ScrlState } from "../../Store/Store"
const LatebrasFeatures:FeatureInfo[]=[
    {
        png:"https://www.monkkee.com/en/wp-content/uploads/sites/3/pencil.png",
        title:"Keep an online journal",
        description:"You want to keep your thoughts in a place where no one can find them? Or capture great ideas so they do not get lost? The online diary Letabras offers you a safe place for your very personal topics."
    },
    {
        png:"https://www.monkkee.com/en/wp-content/uploads/sites/3/private.png",
        title:"Secret and private",
        description:"The use of Letabras is mostly private. There is no feature to make entries publicly viewable unless you explicitly choose not to encrypt the data. This ensures that your secret diary remains safe from prying eyes. Just like in a good old paper diary."
    },
    {
        png:"https://www.monkkee.com/en/wp-content/uploads/sites/3/lock.png",
        title:"Secure and encrypted",
        description:"To guarantee you ultimate security, Letabras uses a comprehensive security concept. Client-side encryption, AES, SSL – find out more about security and why Letabras is unique."
    },
    {
        png:"https://www.monkkee.com/en/wp-content/uploads/sites/3/cloud.png",
        title:"Access via Internet",
        description:"To use Letabras all you need is a computer with Internet access. Whether you are at home or on the move – if you have a sudden urge to write, you can access your data at any time and from anywhere."
    }
]
const Features:React.FC =() =>{
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const navigateRegister=(event:React.MouseEvent<HTMLButtonElement>)=>{
        dispatch({type:"NOT_IN_HOME"})
        navigate("/register",{replace:true})
        
    }
    const navigateLogin=(event:React.MouseEvent<HTMLButtonElement>)=>{
        dispatch({type:"NOT_IN_HOME"})
        navigate("/login",{replace:true})
    }
    return (

    <div >
    <div className="flex justify-center">
    <div className="flex flex-wrap w-3/4">
        {LatebrasFeatures.map((feature,index)=>{
            return <Feature key={index} png={feature.png} title={feature.title} description={feature.description} />
        })}
    </div>
    </div>
    <div className="flex justify-center">
        <div className="flex w-3/4 justify-evenly gap-20 p-10">
            <button onClick={navigateRegister} className="bg-porange rounded-md py-2 w-48  md:w-52 shadow-[#000000] shadow-sm text-white hover:shadow-[#000000] hover:bg-pgray">
                Create an Account
            </button>
            <button onClick={navigateLogin} className="bg-porange rounded-md py-2 w-48  md:w-52 shadow-[#000000] shadow-sm text-white hover:shadow-[#000000] hover:bg-pgray">
                To my Account
            </button>
        </div>
    </div>
    </div>
    )
}

export default Features