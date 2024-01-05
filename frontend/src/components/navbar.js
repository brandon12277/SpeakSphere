import {React,useEffect,useState} from 'react';
import ReactDOM from 'react-dom/client';
import logo from "../static/logo.png"
import "../css/navbar.css"
import { useNavigate, useLocation } from 'react-router-dom';

export function Navbar(props){
    const location = useLocation();
    const currentPath = location.pathname;
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const handleResize = () => {
          setIsMobile(window.innerWidth <= 780);
          if(window.innerWidth > 780)document.querySelectorAll(".blackscreen")[0].style.display = "none";
        };
    
        handleResize(); // Set initial state based on current window width
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);


     return (
        <div style={{width:"100%",zIndex:"1"}}>
            <div className="blackscreen"></div>
        { 
            !isMobile
            ?
        <div className = "navbar">
            <img id="logo" src={logo}></img>
             <div className='nav-contents'>
                 <a className="nav-link" href="/">Home</a>
                 <a className="nav-link" href="/Login">Login</a>
                 <a className="nav-link" href="/Register">Create Account</a>

             </div>
        </div>
        :
        <div className = "navbar" style={{zIndex:"3"}}>
            <button style={{outline:"none",background:"none",border:"none",cursor:"pointer",marginLeft:"4%"}} 
            
            onClick={()=>{
                document.querySelectorAll(".nav-contents-res")[0].style.left = "0%"
                document.getElementById("root").style.overflow= 'hidden';
                document.querySelectorAll(".blackscreen")[0].style.display = "block";
                
            }}>
                <i style={{color:"white",transform:"scale(1.5)"}} class="fa-solid fa-bars"></i>
            </button>
            <div style={{width:"90%",marginLeft:"2%"}}><img id="logo" src={logo}></img></div>
             <div className='nav-contents-res' style={{zIndex:"3"}}>

             <button style={{outline:"none",background:"none",border:"none",cursor:"pointer",marginTop:"15%"}} onClick={()=>{
               document.querySelectorAll(".nav-contents-res")[0].style.left = "-35%"
                document.getElementById("root").style.overflow = 'auto';
                document.querySelectorAll(".blackscreen")[0].style.display = "none";

            }}><i style={{color:"white",transform:"scale(1.5)"}} class="fa-solid fa-xmark"></i></button>
             
                 <a className="nav-link" href="/">Home</a>
                 <a className="nav-link" href="/Login">Login</a>
                 <a className="nav-link" href="/Register">Sign Up</a>

             </div>
        </div>
            
        
        }
        </div>
       
     )
}