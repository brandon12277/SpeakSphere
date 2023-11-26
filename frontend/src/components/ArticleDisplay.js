import {React,useEffect,useState} from 'react';
import axios from "axios"
import { UserNav } from './userNav';
import { useNavigate, useLocation } from 'react-router-dom';
import { PostCard } from './postCard';
import { Navbar } from './navbar';
import { ArticleCard } from './ArticleCard';
import { useParams } from 'react-router-dom';





export function Article(){
    
    const userid = localStorage.getItem('token')
    const isauth = localStorage.getItem('isauth')
    const location = useLocation();
    localStorage.setItem('url',location.pathname)
    const navigate = useNavigate();
    const { article, id } = useParams();
   console.log(isauth)
    const [user,setuser] = useState("");
    const [post,setPost] = useState(null);
    
    

    
 async function fetchData(){
    try{
        console.log(id)
        if(userid){
           let userCred = await axios.get('http://localhost:3000/db/FindUser?userid='+userid)
           setuser(userCred.data)
        }
        
        let article = await axios.get('http://localhost:3000/db/FindArticle?id='+id)
       
       
       

        
        setPost(article.data)
        
 
     }
     catch(err){
       console.log(err)
     }
 }
 useEffect(()=>{

      fetchData()
    


},[]);


if(!post){
    console.log(user)
    return(
    <div className="loading_page">
        <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
     </div>
    )
}
return (
    
<div className="homepage">
    {
        !user?
        <Navbar/>
        :
       
        <UserNav
        user = {user}
        />

    }
    <div className="article">
    {
        !post?
        <div></div>
        :
        <ArticleCard
         data={post}
         user = {user}
         />
    }
    </div>

      
</div>
)


}



