import { ScrlState } from "../Store/Store"
import { useSelector } from "react-redux"
const useAuth =()=>{
   const loggedState = useSelector<ScrlState,any>(state=>state.loginReducer)
   return loggedState.isLogged
}

export default useAuth