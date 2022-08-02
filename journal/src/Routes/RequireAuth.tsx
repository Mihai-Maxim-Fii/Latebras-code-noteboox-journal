import useAuth from "../components/Hooks/useAuth"
import { Outlet } from "react-router"
const RequireAuth:React.FC = () =>{
    const auth=useAuth()

    return (
        auth?<Outlet/>:<div>Forbidden</div>
    )

}

export default RequireAuth