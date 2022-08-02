import  { useEffect, useState } from 'react';
import './App.css';
import MyRoutes from './Routes/MyRoutes';
import { BrowserRouter } from "react-router-dom";

import { useDispatch } from 'react-redux';
import axios from 'axios';
import { ScrlState } from './components/Store/Store';
import useHttp from './components/Hooks/useHttpRequest';
import { useSelector } from 'react-redux';
function App() {

  const {isLoading:loginLoading, isError:loginError, send_request:check_login } = useHttp()

  const dispatch  = useDispatch()


  const loggedState = useSelector<ScrlState, any>(state=>state.loginReducer)
  const treeState = useSelector<ScrlState, any> (state=>state.FolderTreeReducer)


  useEffect(()=>{
    
    const new_request={
      url:"http://localhost:3001/user-api/logstatus",
      method:"GET"
  }
    
    
  
    check_login(new_request, (data:any)=>{
     
      if(data.status==="ok"){
        dispatch({
          type:"LOGIN"
        })
       
        
      }
      else{

        dispatch({
          type:"LOGOUT"
        })
      }
    })


  },[])
  return (
    <BrowserRouter>
    <MyRoutes/>
    </BrowserRouter>
  );
}

export default App;
