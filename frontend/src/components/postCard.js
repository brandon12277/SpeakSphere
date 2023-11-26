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
    

    const handleClick = () =>{
     
           window.location.href=`/${props.article_name}/${props.id}`
      }
          
    return(
       

       
           <div className="card_body" onClick={handleClick}>
            <div className="context">

           
              <div className="name_descp">
                 <h2 id="heading">{props.article_name}</h2>
                 <p id="descp" dangerouslySetInnerHTML={{ __html: props.description }}>
                 
                   {/* {props.description} */}
                 </p>
                 <a href={`/${props.article_name}/${props.id}`}>Learn More</a>
              </div>
              {
                props.image?
               <img src={props.image} id="post_img"></img>
                :
               <img src={no_photo} id="post_img"></img>
               }
              
              </div>

              <div className="stats">
              <div className="details">
              <img style={{width:"50px",height:"auto"}} src={no_profile}></img>{props.name}
                </div>
                <div className="details">
                   <i style={{color:"red"}} class="fa-solid fa-hand-fist"></i>{props.upvotes} Supporters
                </div>
                <div className="details">
                <i style={{color:"grey"}} class="fa-solid fa-thumbs-down"></i>{props.downvotes} Against
                </div>
                
                
              </div>
           </div>


      
    )

}