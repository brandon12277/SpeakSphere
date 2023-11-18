import {React,useEffect,useState} from 'react';
import axios from "axios"
import "../css/create_article.css"
import { UserNav } from './userNav';
import { useNavigate } from 'react-router-dom';

export function NewArticle(){
    
    const userid = localStorage.getItem('token')
    const isauth = localStorage.getItem('isauth')
    const navigate = useNavigate();
   console.log(isauth)
    const [user,setuser] = useState("");
    const [file,setFile] = useState(null)
    const [formData, setFormData] = useState({
        name : "",
        description : "",
        image : ""

    })
 

 async function fetchData(){
    try{
        let userCred = await axios.get('http://localhost:3000/db/FindUser?userid='+userid)
        setuser(userCred.data)
 
     }
     catch(err){
       console.log(err)
     }
 }
 const handleImageChange = (e) => {
    const { name, value } = e.target;
    
    const selectedFile = e.target.files[0];
   
    setFile(selectedFile);
      console.log(formData)
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({
            ...formData,
            "image": reader.result,
          });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async () =>{
    try{
       document.querySelectorAll(".article_form")[0].style.display = "none";
       document.querySelectorAll(".loading")[0].style.display = "flex";
        let form_data = formData
        form_data["file"]=file
        form_data["firebaseUid"] = userid
        form_data["username"] = user.username
        console.log(form_data)
        let article = await axios.post('http://localhost:3000/db/addArticles',form_data,{
            headers: {
              'Content-Type': 'multipart/form-data',
            },
        })
        if(article.data){
            navigate("/Account")
        }
    }
    catch(e){
        console.log(e)
    }
       

  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
 useEffect(()=>{
    if(!isauth){
        navigate("/Login")
     }
      fetchData()
    


},[]);

if(!user){
    return(
        <div>
            Loading
        </div>
    )
}
return (
    
    <div className="homepage">
      <UserNav
         user = {user}
      />
    <div className="createArticle">
    <div className="article_form">
      

         <div className="design_bar">
           <div className="dots">
             <i class="fa-solid fa-circle"></i>
            <i class="fa-solid fa-circle"></i>
            <i class="fa-solid fa-circle"></i>
           </div>
           <div className="preview">
            <button className="pre_butt"><i class="fa-solid fa-magnifying-glass"></i>Preview </button>

           </div>
         </div>
         <div className="img_div" htmlFor="upload" style={{ backgroundImage: `url(${formData.image})` }}>
           
                <input id="upload" type="file" name="file" onChange={handleImageChange}></input>
        </div>
        <div className="article_name_descp">
           
           <input placeholder="Article Name"  type="type" name="name" onChange={handleChange}></input>
           <textarea
            className="responsive-textarea"
            placeholder="Article Description"
            name="description"
            onChange={handleChange}
           />
           <button onClick={handleSubmit} className="submit">Create Post</button>
          
       </div>
       



   </div>
   <div className="loading">
     Creating Post
     <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
   </div>
   
    </div>

    </div>
)


}



