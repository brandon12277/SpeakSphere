import {React,useEffect,useState} from 'react';
import logo from "../static/logo.png"
import "../css/navbar.css"
import axios from "axios"
import { useNavigate, useLocation } from 'react-router-dom';
export function UserNav(props){
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);
    const handleLogout = () =>{
      const url = localStorage.getItem('url')
        localStorage.removeItem('isauth')
        localStorage.removeItem('token')
        if(url)
        window.location.reload()
        else{
          navigate("/")
          window.location.reload()
        }
        

        localStorage.removeItem('url')
       
        
    }

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
        <div style={{zIndex:"1"}} className="blackscreen"></div>
{
  
  !isMobile
  ?
  <div className = "navbar">
  <img id="logo" src={logo}></img>
   <div className='nav-contents'>
   <a className="nav-link" href="/">Home</a>
       <a className="nav-link" href="/my-posts">My Posts</a>
       
       <div className="profile-icon">
       <a className="nav-link" href="">{props.user.username} </a>
       <div class="dropdown">
<button class="dropbtn"> 
<i class="fa fa-caret-down"></i>
</button>
<div class="dropdown-content">
<a className="dropdown-link" href="/NewArticle">New Post</a>
<a className="dropdown-link" onClick={handleLogout}>Log out</a>

</div>
</div> 
       
       </div>
      
    
        
      
      

   </div>
</div>
:
<div className = "navbar" style={{zIndex:"3"}}>

  <button style={{outline:"none",background:"none",border:"none",cursor:"pointer",marginLeft:"1%"}} onClick={()=>{
      document.querySelectorAll(".nav-contents-res")[0].style.left = "0%"
      document.getElementById("root").style.overflow= 'hidden';
      document.querySelectorAll(".blackscreen")[0].style.display = "block";
  }}><i style={{color:"white",transform:"scale(1.5)"}} class="fa-solid fa-bars"></i></button>

  <div style={{width:"90%",marginLeft:"2%"}}><img id="logo" src={logo}></img></div>
  <a style={{marginRight:"4%"}} className="nav-link" href="">{props.user.username} </a>
   <div className='nav-contents-res' style={{zIndex:"3"}}>


   <button style={{outline:"none",background:"none",border:"none",cursor:"pointer",marginTop:"15%"}} onClick={()=>{
               document.querySelectorAll(".nav-contents-res")[0].style.left = "-35%"
                document.getElementById("root").style.overflow = 'auto';
                document.querySelectorAll(".blackscreen")[0].style.display = "none";

            }}><i style={{color:"white",transform:"scale(1.5)"}} class="fa-solid fa-xmark"></i></button>


   
   <a className="nav-link" href="/">Home</a>
       <a className="nav-link" href="/my-posts">My Posts</a>
       
     
       
      


<a className="nav-link" href="/NewArticle">New Post</a>
<button className="nav-link" onClick={handleLogout}>Log out</button>

</div> 
       
</div>
  

}
</div>
)
}