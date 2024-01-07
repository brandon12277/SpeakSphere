import {React,useEffect,useState} from 'react';
import ReactDOM from 'react-dom/client';
import { Navbar } from './navbar';
import "../css/landing.css"

import axios from "axios"
import { PostCard } from './postCard';
import { UserNav } from './userNav';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';







export function LandingPage(){
    const userid = localStorage.getItem('token')
    const isauth = localStorage.getItem('isauth')
    const navigate = useNavigate();
    console.log(userid,isauth)
    const [user,setuser] = useState("");
    const [posts,setPosts] = useState(null);
    const [random,setRandom] = useState(null);
    const [trend,setTrend] = useState(null);
    const [upvoted,setMost] = useState(null);
    
    const handleClick= async (e) => {
        let id = e.target.id 
        if(!id)id = e.target
        document.getElementById("post").style.border = "none";
        document.getElementById("trending").style.border = "none";
        document.getElementById("upvote").style.border = "none";
        document.getElementById(id).style.borderBottom = "2px solid #ec1940";

        if(id == "trending"){
            if(!trend){
                const trendPosts = await axios.get('https://speakserver.onrender.com/db/FindTrending')
                const list = trendPosts.data.map(article => (
                    <PostCard
                    id = {article._id}
                    article_name = {article.article_name}
                    description = {article.description}
                    image = {article.article_img}
                    name= {article.username}
                    upvotes = {article.upvotes.length}
                    downvotes = {article.downvotes.length}
                    
                    />

                    ))
                    setTrend(list)
                    setPosts(list)
            }
            else{
                setPosts(trend)
            }
           
            

            

        }
        else if(id == "upvote"){
            if(!upvoted){
                const upvotedPosts = await axios.get('https://speakserver.onrender.com/db/FindMostVotes')
                const list = upvotedPosts.data.map(article => (
                    <PostCard
                    id = {article._id}
                    article_name = {article.article_name}
                    description = {article.description}
                    image = {article.article_img}
                    name= {article.username}
                    upvotes = {article.upvotes.length}
                    downvotes = {article.downvotes.length}
                    
                    />

                    ))
                    setMost(list)
                    setPosts(list)
            }
            else{
                setPosts(upvoted)
            }
        }
        else if(id == "post"){
           setPosts(random)
        }

    }

 async function fetchData(){

    document.querySelectorAll(".footer")[0].style.display = "none"
    document.getElementById("root").style.overflowY = "auto"
    localStorage.removeItem('url')
    TextTickingAnimation()
    try{
        let userCred = null
        if(userid!=null){
            userCred = await axios.get('https://speakserver.onrender.com/db/FindUser?userid='+userid)
        }
        
        let newposts = await axios.get('https://speakserver.onrender.com/db/FindRandomPosts')
        document.querySelectorAll(".footer")[0].style.display = "flex"
        const list = newposts.data.map(article => (
            <PostCard
            id = {article._id}
            article_name = {article.article_name}
            description = {article.description}
            image = {article.article_img}
            name= {article.username}
            upvotes = {article.upvotes.length}
            downvotes = {article.downvotes.length}
            
            />
           
          
        ))
        if(userCred)setuser(userCred.data)
        setRandom(list)
        setPosts(list)

 
     }
     catch(err){
       console.log(err)
     }
 }
  
    function TextTickingAnimation(){
        let quote = document.querySelectorAll(".quote")[0];
        let text = ' " To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment. " <br> -Ralph Waldo Emerson '
        let itr = 0;
       
       
        
        let animation = setInterval(()=>{
           
            if(itr+1 == text.length)clearInterval(animation)
             if(quote && itr>0 && text[itr-1] !== '<')
             quote.innerHTML=text.substring(0, itr++);
            else
            itr++;
            
    
        },100)
    }
    
    useEffect(()=>{
        fetchData()
        return () => {}
    },[])
    if(!isauth){
        return (
            <div className = "cont">
                 <Navbar/>
                 <div  style={{zIndex:"0"}}className="top-component">
                     <h3 style={{zIndex:"0"}} className= "quote"></h3>
                     <button className="SignUp"><a className="nav-link" href="/Register">Sign Up For Free</a></button>
                 </div>
                 <div className="bottom-component">
                  <div className="bottom-nav">
                     <button style={{borderBottom:"3px solid #ec1940"}} onClick={handleClick} id="post" className="bottom-nav-link"><i onClick={handleClick} id="post" class="fa-solid fa-globe"></i> Posts</button>
                     <button onClick={handleClick} id="trending" className="bottom-nav-link"><i onClick={handleClick} id="trending" class="fa-solid fa-arrow-trend-up"></i > Trending</button>
                     <button  onClick={handleClick} id="upvote" className="bottom-nav-link"><i onClick={handleClick} id="upvote" class="fa-solid fa-arrow-up-short-wide"></i> Most Upvoted</button>
                  </div>
                 </div>
                 <div className="post_landing_page">
                  {
                    !posts?
                    
                    <div className="">
                         <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                    </div>
                    :
                    <div className="list_landing_page">{posts}</div>
                  }
                 
                  
               </div>
              
            </div>
         )
    }
   else{

    if(!user && userid){
        return(
            <div className="loading_page">
                  <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }
    return (
    
        <div className="cont">
          <UserNav
             user = {user}
          />
           <div className="bottom-component">
            
                  <div className="bottom-nav">
                     <button style={{borderBottom:"3px solid #ec1940"}} onClick={handleClick} id="post" className="bottom-nav-link"><i class="fa-solid fa-globe"></i> Posts</button>
                     <button onClick={handleClick} id="trending" className="bottom-nav-link"><i class="fa-solid fa-arrow-trend-up"></i> Trending</button>
                     <button  onClick={handleClick} id="upvote" className="bottom-nav-link"><i class="fa-solid fa-arrow-up-short-wide"></i> Most Upvoted</button>
                  </div>
                
    
        </div>
        <div className="posts">
                  {
                    !posts?
                    <div>
                         <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                    </div>
                    :
                    <div className="list">{posts}</div>
                  }
                 
                  
               </div>
       
        </div>
    )
}
     
}