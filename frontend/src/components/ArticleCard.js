import {React,useEffect,useState} from 'react';
import ReactDOM from 'react-dom';
import axios from "axios"

import "../css/article_card.css"
import PieChart from './PieChart';
import BarChart from './BarChart';
import Comment_Box from './CommentBox';




export function ArticleCard(props){
  let stats = [];
  
  const [addComm,setLoad] = useState(1)
  const [child_comment,setChild] = useState([])
  const [comment,setComment] = useState("")
  const [comments_bar,setDisplayComments] = useState("")
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComment(value);
  };
  useEffect(()=>{
     
  },[comments_bar])

  useEffect(()=>{
   
      
     let comments = props.data.comments.map((comment) =>(

         <Comment_Box
           comment_id = {comment._id}
           _id = {props.data._id}
           firebaseUid = {props.user.firebaseUid}
           username = {props.user.username}
           name = {comment.user.username}
           content = {comment.content}
           replies = {comment.replies}
           choice = {comment.choice}
         
         />

     ))

     setDisplayComments(comments)

     const timerId = setTimeout(async () => {
      
      const formdata={
        "_id" : props.data._id,
        "firebaseUid" : props.user.firebaseUid,
        "category"  : "neutralvotes"
      }

      let give_neutral_vote = await axios.post("https://speakserver.onrender.com/db/handlevote",formdata)
      
  
      

      

    }, 60000);

   
    return () => clearTimeout(timerId);

  },[])

  function containsElement(arr, elementToFind) {


    return arr.some((element) => element.userId === elementToFind.userId);
  }

  async function AddComment(id,userid,username){
       
       setLoad(null)
 
       if(!userid){
        document.querySelectorAll(".comment_bar")[0].value = "";
        document.getElementById("notice").innerHTML = "Please login to give an opinion and comment on the follow"
        document.querySelectorAll(".black")[0].style.display = "flex";
        document.querySelectorAll(".warning_notice")[0].style.display = "flex";
        return ;
      }
       
     

      
      
      
      let check_if_commentable = await axios.get("https://speakserver.onrender.com/db/CheckVotestatus?id="+id+"&userid="+userid)
     
      let choice = check_if_commentable.data === 1?"Support" : check_if_commentable.data === 2 ? "Against" : false;

     
      if(choice != false){
        const formdata={
          "_id" : id,
          "username" : username,
          "firebaseUid" :userid,
          "content"  : comment,
          "choice" : choice
        }

      let add_comment = await axios.post("https://speakserver.onrender.com/db/AddComment",formdata)

      console.log(add_comment.data)

     if(add_comment.data.done){
        document.querySelectorAll(".comment_bar")[0].value = "";

        let comment_new = <Comment_Box
        comment_id = {add_comment.data.comment_id}
        _id = {id}
        firebaseUid = {userid}
        username = {username}
        name = {username}
        content = {comment}
        replies = {[]}
        choice = {choice}
      
      />
      setChild([...child_comment, comment_new]);
      
       

      }
    }
    else{
      document.querySelectorAll(".comment_bar")[0].value = "";
      document.getElementById("notice").innerHTML = "You cannot give a comment when you have not given an opinion."
      document.querySelectorAll(".black")[0].style.display = "flex";
      document.querySelectorAll(".warning_notice")[0].style.display = "flex";
    }
    setLoad(1)
    
  }

 function setStats(x){
  stats = {
    labels: ['Upvotes', 'Downvotes', 'Neutral','Changed'],
    datasets: [
      {
        label: 'Opinion Analysis',
        backgroundColor: ['rgb(222, 48, 48)', 'grey', 'pink','lightgreen'], // Set colors for each segment
        data: [props.data.upvotes.length+x,props.data.downvotes.length,props.data.neutralvotes.length,props.data.changedvotes.length], // Your data here
      },
    ],
  }
 }
  function Goback(){
      document.querySelectorAll(".black")[0].style.display = "none";
      document.querySelectorAll(".warning_notice")[0].style.display = "none";
  }
  async function handleVote(id,userid,vote){
    
    if(!userid){
      document.getElementById("notice").innerHTML = "Please login to give an opinion and comment on the follow"
      document.querySelectorAll(".black")[0].style.display = "flex";
      document.querySelectorAll(".warning_notice")[0].style.display = "flex";
      return ;
    }
    
    

          const formdata={
            "_id" : id,
            "firebaseUid" : userid,
            "category"  : vote
          }
          
          if(vote === "upvotes"){
            document.querySelectorAll(".upvote_butt")[0].classList.add("upvote_butt_focus")
            document.querySelectorAll(".against_butt")[0].classList.remove("against_butt_focus")
          }
          
         else if(vote === "downvotes"){
          document.querySelectorAll(".against_butt")[0].classList.add("against_butt_focus")
          document.querySelectorAll(".upvote_butt")[0].classList.remove("upvote_butt_focus")
         }
        


         let update_of_vote = await axios.post("https://speakserver.onrender.com/db/handlevote",formdata)
          console.log(update_of_vote)
          
         
  
   
   
  
  
  }
  const article = props.data
  if(article.upvotes.length == 0 && article.downvotes.length == 0 && article.neutralvotes.length == 0 && article.downvotes.length == 0){
    stats = {
      labels: ['No Votes'],
      datasets: [
        {
          label: 'No Opinion Given',
          backgroundColor: ['grey'],
          data: [1], 
        },
      ],
    }
   }
   else{
    setStats(0)
  }

  
   

  const handleSubmitButton = () =>{
     document.querySelectorAll(".button_div_comments")[0].style.display = "flex";

  }
  const handleCollapse = () =>{
    document.querySelectorAll(".button_div_comments")[0].style.display = "none";
    
 }
 
  
return(
  <div>
   
    <div className="black">
       <div className="warning_notice">
            <h3 id="notice"></h3>
            <div className="choice_buttons">
                 <button onClick={Goback} className="comment_butt">Go Back</button>
            </div>
      </div>
    </div>
    <div className="article_card">
        <p style={{fontFamily:"'Inter', sans-serif"}}><i style={{color:"red"}} class="fa-solid fa-eye"></i> {props.data.upvotes.length+props.data.downvotes.length+props.data.neutralvotes.length}</p>
        <p className="article_head">{props.data.article_name}</p>
       
        {
           props.data.article_img?
           <div className="article_img" style={{ backgroundImage: `url(${props.data.article_img})` }}> </div>
            :
          <div></div>
        }
            
       
        <div className="created_by">
          Created By  <span style={{fontWeight:"bold",color:"#78081C"}}>{props.data.username}</span>
          &nbsp; &nbsp; 
        </div>
        <div className="statistical">
          <PieChart data={stats} />
          <BarChart data={stats} />
        </div>
        <div className="description_field" dangerouslySetInnerHTML={{ __html: props.data.description }} />
        <div className="choice_buttons">
        {containsElement(props.data.upvotes,{"userId":props.user.firebaseUid})
            ?
            <button className="upvote_butt upvote_butt_focus" onClick={()=>{handleVote(props.data._id,props.user.firebaseUid,"upvotes")}} ><i class="fa-solid fa-hand-fist"></i>Support</button>
            :
            <button onClick={()=>{handleVote(props.data._id,props.user.firebaseUid,"upvotes")}} className="upvote_butt"><i class="fa-solid fa-hand-fist"></i>Support</button>
        }
         {containsElement(props.data.downvotes,{userId:props.user.firebaseUid})
            ?
            <button  onClick={()=>{handleVote(props.data._id,props.user.firebaseUid,"downvotes")}} className="against_butt against_butt_focus"> <i class="fa-solid fa-thumbs-down"></i>Against</button>
            :
            <button  onClick={()=>{handleVote(props.data._id,props.user.firebaseUid,"downvotes")}} className="against_butt"> <i class="fa-solid fa-thumbs-down"></i>Against</button>
        }
              
             
        </div>
        <div className="comment_box">
            <h2 style={{ fontFamily: "'Lato', sans-serif"}}>{props.data.comments.length + child_comment.length} Comments</h2>
            <input  onFocus={handleSubmitButton} onChange={handleChange} type= "text" name="comment" className="comment_bar" id="comment_bar" placeholder='Add a Comment'></input>
            <div className="button_div_comments">
              {
                addComm?
              
               <button onClick={()=>{AddComment(props.data._id,props.user.firebaseUid,props.user.username)}} className="comment_butt">Comment</button>
               :
               <div className="loading_page">
                  <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
               </div>
              }
            </div>

            <div className="comments" id="comments">
            {child_comment.map((child) => (
                 child
             ))}
              {comments_bar}
            </div>
        </div>
       

    </div>
  </div>
)


}
