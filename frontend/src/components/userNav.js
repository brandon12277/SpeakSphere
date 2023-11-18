import {React,useEffect,useState} from 'react';
import logo from "../static/logo.png"
import "../css/navbar.css"
import axios from "axios"
import { useNavigate } from 'react-router-dom';
export function UserNav(props){
    const navigate = useNavigate();
    const handleLogout = () =>{
        localStorage.removeItem('isauth')
        localStorage.removeItem('token')
        navigate("/")
        
    }
     return (

        <div className = "navbar">
            <img style={{width:"200px",height:"auto"}}src={logo}></img>
             <div className='nav-contents'>
             <a className="nav-link" href="/Account">Home</a>
                 <a className="nav-link" href="/Account/my-posts">My Posts</a>
                 
                 <div className="profile-icon">
                 <a className="nav-link" href="">{props.user.username} </a>
                 <div class="dropdown">
    <button class="dropbtn"> 
      <i class="fa fa-caret-down"></i>
    </button>
    <div class="dropdown-content">
      <a className="dropdown-link" href="/Account/NewArticle">New Post</a>
      <button className="dropdown-link" onClick={handleLogout}>Log out</button>
     
    </div>
  </div> 
                 
                 </div>
                
              
                  
                
                

             </div>
        </div>
     )
}