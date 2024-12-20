import {React,useEffect,useState} from 'react';
import axios from "axios"
import "../css/postcard.css"
import photo from "../static/thinker.jpg"
import { UserNav } from './userNav';
import { useNavigate } from 'react-router-dom';
import no_photo from "../static/no_photo.jpg"
import no_profile from "../static/no-profile.png"


export function PostCard(props){
    const navigate = new useNavigate()
    const [divclick,setClick] = useState(true)
    const delete_class = "black_"+props.id
    const [isMobile, setIsMobile] = useState(false);
    const handleClick = () =>{
     
           navigate(`/${encodeURIComponent(props.article_name)}/${encodeURIComponent(props.id)}`)
      }
      const handleUpdateClick = () =>{
     
        navigate(`UpdateArticle/${encodeURIComponent(props.article_name)}/${encodeURIComponent(props.id)}`)
   }
      
      useEffect(() => {
        const handleResize = () => {
          setIsMobile(window.innerWidth <= 480);
        };
    
        handleResize(); 
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

      function handleBlack(event){
        document.querySelectorAll("."+delete_class)[0].style.display = "flex";
        setClick(false)
        event.stopPropagation()
        
       }


      async function handleDelete(){
        const form_data = {
          "_id" : props.id
        }
         const delete_post = await axios.post("https://speakserver.onrender.com/db/DeletePost",form_data)
         if(delete_post.data)window.location.reload()
         
      }
    return(
       

       

      
           < div style={{cursor:"auto"}} className="card_body"  

            
            onClick={
            ()=>{
                if(divclick && !props.delete)
                  {handleClick()}
            }
            

          }
          
             >
             <div id="black" className={delete_class}>
                   <div className="block">
                       <p>Are you sure you want to delete this post?</p>
                       <div style={{width:"100%",gap:"5%"}}>
                        <button  onClick={handleDelete} className="delete_post">Yes</button><button onClick={
                        ()=>{
                          document.querySelectorAll("."+delete_class)[0].style.display = "none";
                          setClick(true)
                        }
                       } className="no">No</button></div>
                   </div>
             </div>

             <div className='' style={{display:"flex",gap : "10%",marginBottom:"3%"}}>

             {props.delete? <div> <button style={{zIndex:"3"}} onClick={handleBlack}  className="delete"><i style={{color:"#78081C",transform:'scale(1.3)'}} class="fa-solid fa-trash"></i></button> </div> : <div></div>}
             {props.update? <div> <button style={{zIndex:"3"}} onClick={(e)=>{e.preventDefault(); handleUpdateClick()}}  className="delete"><i style={{color:"#78081C",transform:'scale(1.3)'}} class="fa-solid fa-pen"></i></button> </div> : <div></div>}
             {props.update? <div> <button style={{zIndex:"3"}} onClick={(e)=>{handleClick()}}  className="delete"><i style={{color:"#78081C",transform:'scale(1.3)'}} class="fa-solid fa-eye"></i></button> </div> : <div></div>}

             </div>
            
            <div className="context">

           
              <div className="name_descp">
                 <h2 id="heading">{props.article_name}</h2>
                 <p id="descp" dangerouslySetInnerHTML={{ __html: props.description }}>
                 
                 
                 </p>
                 <a href={`/${encodeURIComponent(props.article_name)}/${encodeURIComponent(props.id)}`}>Learn More</a>
              </div>
              {
                props.image?
                
               <img style={{justifySelf:"flex-end"}} src={props.image} id="post_img"></img>
               
                :
               
               <img style={{justifySelf:"flex-end"}} src={no_photo} id="post_img"></img>
               
               }
              
              </div>

              <div className="stats">
              <div className="details">
              <img style={{width:"50px",height:"auto"}} src={no_profile}></img>{props.name}
                </div>
                {
                  !isMobile
                  ?
                  <div className="stats">
                     <div className="details">
                   <i style={{color:"red"}} class="fa-solid fa-hand-fist"></i>{props.upvotes} Supporters
                </div>
                <div className="details">
                <i style={{color:"grey"}} class="fa-solid fa-thumbs-down"></i>{props.downvotes} Against
                </div>
                    </div>
                    :
                    <div className="stats">
                    </div>
                }
               
                
                
              </div>
           </div>
         


      
    )

}