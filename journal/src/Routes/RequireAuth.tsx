import useAuth from "../components/Hooks/useAuth"
import { Outlet } from "react-router"
import Forbidden from "../components/Forbidden/Forbidden"
const RequireAuth:React.FC = () =>{
    const auth=useAuth()

    return (
        auth?<Outlet/>:<Forbidden></Forbidden>
    )

}

export default RequireAuth