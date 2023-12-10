import {React,useEffect,useState} from 'react';
import axios from "axios"
import { UserNav } from './userNav';
import { useNavigate } from 'react-router-dom';
import { PostCard } from './postCard';
import "../css/comment_card.css"
import no_profile from "../static/no-profile.png"
import Reply from './Reply';

export default function Comment_Box(props){
  const [display,setDisp] = useState("block")
  const [child_reply,setChild] = useState([])
    const [reply,setReply] = useState("")
    const [replies_bar,setDisplayReplies] = useState("")
    const reply_div = "comment_"+props.comment_id
    const reply_div_bar = "reply_div_comments_"+props.comment_id
    
    
   useEffect(()=>{
    let comments = props.replies.map((reply) =>(

      <Reply
        comment_id = {props.comment_id}
        name = {reply.user.username}
        content = {reply.content}
        choice = {reply.choice}
      
      />

  ))

  setDisplayReplies(comments)
   },[])

    const handleSubmitButton = () =>{
        document.querySelectorAll("."+reply_div_bar)[0].style.display = "flex";
   
     }
     const handleChange = (e) => {
        const { name, value } = e.target;
        setReply(value);
      };
     async function AddReply(comment_id,id,userid,username){
           if(!userid){
            console.log(userid)
            document.querySelectorAll("#"+reply_div)[0].value = "";
            document.getElementById("notice").innerHTML = "Please login to give an opinion and comment on the follow"
            document.querySelectorAll(".black")[0].style.display = "flex";
            document.querySelectorAll(".warning_notice")[0].style.display = "flex";
            return ;
          }
           
         
    
           console.log("Hello")
          
          
          let check_if_commentable = await axios.get("https://speakserver.onrender.com/db/CheckVotestatus?id="+id+"&userid="+userid)
         
          let choice = check_if_commentable.data === 1?"Support" : check_if_commentable.data === 2 ? "Against" : false;
    
         
          if(choice != false){
            const formdata={
              "_id" : id,
              "comment_id" : comment_id,
              "username" : username,
              "firebaseUid" :userid,
              "content"  : reply,
              "choice" : choice
            }
    
          let add_comment = await axios.post("https://speakserver.onrender.com/db/AddReply",formdata)
          
          if(add_comment.data){

            document.querySelectorAll("#"+reply_div)[0].value = "";
            let reply_new =  <Reply
            comment_id = {comment_id}
            name = {username}
            content = {reply}
            choice = {choice}
          
          />
          setChild([...child_reply, reply_new]);
          document.querySelectorAll("#"+reply_div_bar)[0].style.display = "block"
          setDisp("none")
    
    
          }
        }
        else{
          document.querySelectorAll("#"+reply_div)[0].value = "";
          document.getElementById("notice").innerHTML = "You cannot give a comment when you have not given an opinion."
      document.querySelectorAll(".black")[0].style.display = "flex";
      document.querySelectorAll(".warning_notice")[0].style.display = "flex";
        }
        
      }

      function handleReplyBar(){
       
        document.querySelectorAll("."+reply_div)[0].style.display = "block";
        document.querySelectorAll("#"+reply_div)[0].value = "@"+props.name;
      }

      function handleReplyDisplay(){
        document.querySelectorAll("#"+reply_div_bar)[0].style.display = display;
        if(display === "none")
        setDisp("block")
        else
        setDisp("none")
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
                <div id="reply_div" className={reply_div}>
                <input  onFocus={handleSubmitButton} onChange={handleChange} type= "text" name="comment" id={reply_div} className="comment_bar" placeholder='Add a Comment'></input>
            <div id="reply_div_comments" className={reply_div_bar}>
               <button onClick={()=>{AddReply(props.comment_id,props._id,props.firebaseUid,props.username)}} className="comment_butt">Reply</button>
            </div>
                </div>
                {
                    props.replies.length === 0 && child_reply.length === 0
                    ?
                       <div></div>
                    :
                    <div className="comment_foot">
                      <button onClick={handleReplyDisplay} style={{cursor:"pointer",display:"flex",padding:"0%",outline:"0",background:"none",border:"none"}}><h4>Replies({props.replies.length})</h4></button>
                      <div className="replies" id={reply_div_bar}>
                      {child_reply.map((child) => (
                               child
                      ))}
                        {replies_bar}
                      </div>
                    </div>
                    

                }
               
        </div>
    )
}
