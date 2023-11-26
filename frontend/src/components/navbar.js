import React from 'react';
import ReactDOM from 'react-dom/client';
import logo from "../static/logo.png"
import "../css/navbar.css"
import { useNavigate, useLocation } from 'react-router-dom';

export function Navbar(props){
    const location = useLocation();
    const currentPath = location.pathname;
    
   
     return (
        <div className = "navbar">
            <img style={{width:"200px",height:"auto"}}src={logo}></img>
             <div className='nav-contents'>
                 <a className="nav-link" href="/">Home</a>
                 <a className="nav-link" href="/Login">Login</a>
                 <a className="nav-link" href="/Register">Create Account</a>

             </div>
        </div>
     )
}