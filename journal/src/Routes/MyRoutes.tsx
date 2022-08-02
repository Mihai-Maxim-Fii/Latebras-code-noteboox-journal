import { Routes, Route, Navigate } from "react-router"

import About from "../components/About/About"
import Header from "../components/Header/Header"
import Login from "../components/Login/Login"
import Register from "../components/Register/Register"
import { ScrlState } from "../components/Store/Store"
import { useSelector } from "react-redux"
import { LoginDisabled } from "../components/Login/LoginDisabled"
import { useEffect, useState } from "react"
import Dashboard from "../components/Dashboard/Dashboard"
import Entries from "../components/Journal/Entries/Entries"
import RequireAuth from "./RequireAuth"
 const MyRoutes:React.FC=()=>{
    return (
        <Routes>
        
            <Route path="/" element={<Header/>}>
                <Route path="home" element={<About/>}></Route>
                <Route path="login" element={<Login/>}></Route>
                <Route path="register" element={<Register/>}></Route>
            </Route>

            <Route element={<RequireAuth></RequireAuth>}>
            <Route path="/"  element={<Dashboard></Dashboard>}>
            <Route path="entries" element = {<Entries></Entries>}></Route>
            </Route>
            </Route>

        <Route path="*" element={<div>Invalid path...</div>}>

        </Route>

        </Routes>
)

}

export default MyRoutes