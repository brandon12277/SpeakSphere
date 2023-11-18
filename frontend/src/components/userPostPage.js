import {React,useEffect,useState} from 'react';
import axios from "axios"
import "../css/userpostpage.css"
import { UserNav } from './userNav';
import { useNavigate } from 'react-router-dom';
import { PostCard } from './postCard';

export function UserPostPage(){
    const userid = localStorage.getItem('token')
    const isauth = localStorage.getItem('isauth')
    const navigate = useNavigate();
    const [user,setuser] = useState("");
    const [articleList,setList] = useState(null);


 async function fetchData(){
    try{
        let userCred = await axios.get('http://localhost:3000/db/FindUser?userid='+userid)
        let article_pulled = await axios.get('http://localhost:3000/db/PullArticles?userid='+userid)
        console.log(article_pulled.data)
        
        const list = article_pulled.data.map(article => (
                <PostCard
                  
                article_name = {article.article_name}
                description = {article.description}
                image = {article.article_img}
                name= {article.username}
                upvotes = {article.upvotes.length}
                downvotes = {article.downvotes.length}
                
                />
               
              
        ))
  console.log(list)
        

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
        <div>
            Loading
        </div>
    )
}
    return(
        <div className="cont">
            <UserNav
              user = {user}
            
            />
       <h3 className="page_head" style={{textAlign:"center"}}>My Posts</h3>
        {
        
         !articleList || articleList.length == 0
        ?
        <div className="empty"><i class="fa-solid fa-newspaper"></i>No posts currently <a className="dropdown-link" href="/Account/NewArticle">Create a Post</a></div>
        :
        <div className="list">{articleList}</div>

        }
        
        </div>
    )
}