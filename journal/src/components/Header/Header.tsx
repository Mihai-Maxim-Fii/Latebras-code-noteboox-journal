import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router"
import { Squash as Hamburger } from 'hamburger-react'
import Footer from "../Footer/Footer"
import {Link} from "react-scroll"
import classes from "./Header.module.css"
import { useDispatch, useSelector } from "react-redux"
import { ScrollState } from "../Store/Reducers/ScrollReducer"
import { ScrlState } from "../Store/Store"
import { NavLink } from "react-router-dom"
import { useLocation } from "react-router-dom";
const Header:React.FC= ()=>{
    const navigate = useNavigate()
    const [showBurger,setShowBurger]=useState(false)
    const [showMenuItems, setShowMenuItems] = useState(true)
    const [showMenu, setShowMenu] = useState(true)
    const showState = useSelector<ScrlState, any>(state=>state.scrollReducer)

    
    const dispatch = useDispatch()

    
    const location = useLocation()
    const clickSecurity = ()=>{
        dispatch({
            type:"SECURITY_VISIBLE",
            payload:{}
        })
        navigate("/home",{replace:true})
    }



    const clickFeatures =()=>{
        
        dispatch({
            type:"FEATURES_VISIBLE",
            payload:{}
        })
        navigate("/home",{replace:true})
    }

    const clickLogin =()=>{
        setShowMenu(false)
    }

    const disableMenu = ()=>{
        setShowMenu(true)
        dispatch({type:"IN_MENU"})
    }

    const homeState = useSelector<ScrlState,any>(state=>state.homeReducer)

    useEffect(()=>{
     if(!homeState.inHome){
      setShowMenu(false)
     }

    },homeState.isHome)
    
    useEffect(()=>{
        if (window.innerWidth<768){
            setShowMenuItems(false)
            setShowBurger(true)
        }

        window.addEventListener("resize",()=>{
          if (window.innerWidth<768){
              setShowMenuItems(false)
              setShowBurger(true)
          }
          else{
              setShowBurger(false)
              setShowMenuItems(true)
          }
        })
    },[])



    var hdr_classname:string=(showMenuItems===true)?"bg-ppink flex justify-center md:justify-start transition-all opacity-100 duration-500 ":" bg-ppink flex justify-center md:justify-start transition-all opacity-0 duration-500 "

 
    return (
        <div style={{minHeight:"100vh"}}  className="flex flex-col justify-between">
        <div>
        <div className=" sticky top-0">
        <div className="bg-pgray flex justify-center md:justify-start h-16 ">
        <div className="md:flex mt-1 md:mt-0 md:basis-full md:justify-between px-16 items-center">
            <div className="flex justify-center" >
               <div className="text-white">
                   Latebras
               </div>
            </div>
            <div className="flex justify-center text-porange">
                Support Latebras
            </div>
        </div>
         {showBurger&&
        <div className="absolute right-5 top-1">
        <Hamburger size={25} toggled={showMenuItems} toggle={setShowMenuItems} color="#ffffff" ></Hamburger>
        </div>
        }
        </div>
       
         
        {showMenuItems&&
        <div className={hdr_classname} >
            <ul className="flex md:basis-full md:justify-end px-10 gap-5 py-2">


            {(location.pathname==="/home"||location.pathname==="/register")?
            <li className="flex justify-center text-black">
                <NavLink to="/login" onClick={clickLogin} >
                    Login
                </NavLink>
            </li>:null
           
            }

            {(location.pathname==="/login")?
            <li className="flex justify-center text-black">
                <NavLink to="/register" onClick={clickLogin} >
                    Register
                </NavLink>
            </li>:null
            }

            {!showMenu&&
            <li className="flex justify-center">
            <NavLink  to="/home" onClick={disableMenu}>Home</NavLink>
            </li>
                }
            {showMenu&&
            <li className="flex justify-center">
            <Link  to="introduction" onClick={clickFeatures}  spy={true}  className={showState.showFeatures==true?classes.active:""} offset={-20} smooth={true}><p className=" cursor-pointer">Features</p></Link>
            </li>
                }
            {showMenu&&
            <li className="flex justify-center">
            <Link  to="security" onClick={clickSecurity} spy={true} offset={-70} className={showState.showSecurity==true?classes.active:""}  smooth={true}><p className=" cursor-pointer">Security</p></Link>
            </li>
            }
            </ul>
        </div>
        }
        </div>
        <Outlet ></Outlet>
        </div>
        <Footer/>
        </div>
    )

}

export default Header