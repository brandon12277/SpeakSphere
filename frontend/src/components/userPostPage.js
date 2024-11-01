import {React,useEffect,useState} from 'react';
import axios from "axios"
import "../css/userpostpage.css"
import { UserNav } from './userNav';
import { useNavigate } from 'react-router-dom';
import { PostCard } from './postCard';
import Footer from './Footer';

export function UserPostPage(){
    const userid = localStorage.getItem('token')
    const isauth = localStorage.getItem('isauth')
    const navigate = useNavigate();
    const [user,setuser] = useState("");
    const [articleList,setList] = useState(null);


 async function fetchData(){
    try{
        let userCred = await axios.get('https://speakserver.onrender.com/db/FindUser?userid='+userid)
        let article_pulled = await axios.get('https://speakserver.onrender.com/db/PullArticles?userid='+userid)
        
        const list = article_pulled.data.map(article => (
                <PostCard
                id = {article._id}
                article_name = {article.article_name}
                description = {article.description}
                image = {article.article_img}
                name= {article.username}
                upvotes = {article.upvotes.length}
                downvotes = {article.downvotes.length}
                delete = {true}
                update = {true}
                />
               
              
        ))
  
        

        setuser(userCred.data)
        setList(list)
 
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

if(!user && articleList === null){
    return(
        <div className="loading_page">
              <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
        </div>
    )
}
    return(
        <div className="cont-page">
            <UserNav
              user = {user}
            
            />
       <h3 className="page_head" style={{textAlign:"center"}}>My Posts</h3>
        {
        
         !articleList || articleList.length == 0
        ?
        <div className="empty"><i class="fa-solid fa-newspaper"></i>No posts currently <a className="dropdown-link" href="/NewArticle">Create a Post</a></div>
        :
        <div className="list">{articleList}</div>

        }
        
        </div>
    )
}