import {React,useEffect,useState} from 'react';
import axios from "axios"
import { UserNav } from './userNav';
import { useNavigate } from 'react-router-dom';
import { PostCard } from './postCard';
import "../css/comment_card.css"
import no_profile from "../static/no-profile.png"

export default function Reply(props){
    const reply_div = "comment_"+props.comment_id
    function handleReplyBar(){
       
        document.querySelectorAll("."+reply_div)[0].style.display = "block";
        document.querySelectorAll("#"+reply_div)[0].value = "@"+props.name;
      }
    return(
      
        <div className="comment_box">
                <div style={{display:"flex"}}>

                
                <div className="user-details">
                    <img  style={{width:"50px",height:"auto"}} src={no_profile}></img> 
                </div>
                <p className="content"><div className="name_det">{props.name} <span className={props.choice}>{props.choice}</span></div> {props.content}</p>
                
               
                </div>
                <button className="replies_butt" onClick={handleReplyBar}>Reply</button>
               
        </div>
    )
}
