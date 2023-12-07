import {React,useEffect,useState} from 'react';
import axios from "axios"
import "../css/userhome.css"
import "../css/landing.css"
import { UserNav } from './userNav';
import { useNavigate } from 'react-router-dom';
import { PostCard } from './postCard';
import Footer from './Footer';

export function UserHomePage(){
    
    const userid = localStorage.getItem('token')
    const isauth = localStorage.getItem('isauth')
    const navigate = useNavigate();
   console.log(isauth)
    const [user,setuser] = useState("");
    const [posts,setPosts] = useState(null);
    const [random,setRandom] = useState(null);
    const [trend,setTrend] = useState(null);
    const [upvoted,setMost] = useState(null);

    const handleClick= async (e) => {
        let id = e.target.id 
        console.log(id)
        document.getElementById("post").style.border = "none";
        document.getElementById("trending").style.border = "none";
        document.getElementById("upvote").style.border = "none";
        document.getElementById(id).style.borderBottom = "3px solid #ec1940";

        if(id === "trending"){
            if(!trend){
                const trendPosts = await axios.get('http://localhost:3000/db/FindTrending')
                console.log(trendPosts.data)
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
        else if(id === "upvote"){
            if(!upvoted){
                const upvotedPosts = await axios.get('http://localhost:3000/db/FindMostVotes')
                console.log(upvotedPosts.data)
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
    try{
        let userCred = await axios.get('http://localhost:3000/db/FindUser?userid='+userid)
        let newposts = await axios.get('http://localhost:3000/db/FindRandomPosts')
        console.log(newposts.data)
        
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

        setuser(userCred.data)
        setRandom(list)
        setPosts(list)
 
     }
     catch(err){
       console.log(err)
     }
 }
 useEffect(()=>{
    if(!isauth){
        navigate("/Login")
     }
      fetchData()
    


},[]);

useEffect(()=>{
  
    


},[posts]);

if(!user){
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



