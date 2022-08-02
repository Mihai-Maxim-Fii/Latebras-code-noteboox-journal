import { useInView } from "react-intersection-observer"
import { useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
const Security:React.FC =()=>{

    const scrollState = useSelector(state=>state)
    const dispatch = useDispatch()

    const {ref:securityRef, inView, entry} =useInView()
    useEffect(()=>{
        if(inView){
        dispatch({
            type:"SECURITY_VISIBLE",
            payload:{}
        })
    }
    else{
        dispatch({
            type:"FEATURES_VISIBLE",
            payload:{}
        })
    }
    },[inView])

    return (<div className="flex justify-center mb-10" >
        <div className="w-3/4">
        <div className="border-t border-1 bg-pgray m-2 " id="security">
        </div>
        <div className="flex justify-center mt-8 mb-6 text-xl">
        <p>
            Security
        </p>
        </div>
        <div>
            <p className="p-3">
            The free online diary Latebras offers you the safest place for your thoughts. A comprehensive security concept protects your content against unauthorized access. And this is how it works:
            </p >
            <p className="p-3">
            As soon as content created by you is saved, it is directly encrypted on your computer, i.e. even before its leaves your device and is transferred to the server via the Internet. With this end-to-end encryption approach Latebras set themselves apart from other competitors who do not encrypt user data at all or only provide server-side encryption.
            </p>
            <img ref={securityRef} className="p-5"src="https://www.monkkee.com/en/wp-content/uploads/sites/3/encryption_process.png">
            </img>
            <p className="p-3"> 
            The encryption method used is AES-256. Initially developed for military purposes, this highly secure encoding technology is nowadays used by governments, institutions and banks to encrypt top-secret information.
            </p>

            <p className="p-3"> 
            The encrypted data is transferred directly between your device and the server. For this purpose, Latebras uses an additional SSL-based encryption technology. That way, no one can eavesdrop on the transfer.
            </p>
        </div>
        </div>
    </div>)
}
export default Security