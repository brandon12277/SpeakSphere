import {React,useEffect,useState,useRef} from 'react';
import axios from "axios"
import "../css/create_article.css"
import { UserNav } from './userNav';
import { useNavigate } from 'react-router-dom';

import RichTextEditor from './RichTextEditor';
import Footer from './Footer';

export function NewArticle(){
    
    const userid = localStorage.getItem('token')
    const isauth = localStorage.getItem('isauth')
    const navigate = useNavigate();
   console.log(isauth)
   const fileInputRef = useRef(null);
   const [inputVal,setVal] = useState("")
    const [user,setuser] = useState("");
    const [file,setFile] = useState(null)
    const [formData, setFormData] = useState({
        name : "",
        description : "",
        image : ""

    })
    
 
    const handleButtonClick = () => {
      // Trigger the file input click event
      fileInputRef.current.click();
    };

 async function fetchData(){
    try{
        let userCred = await axios.get('https://speakserver.onrender.com/db/FindUser?userid='+userid)
        setuser(userCred.data)
 
     }
     catch(err){
       console.log(err)
     }
 }
 const handleImageChange = (e) => {
    const { name, value } = e.target;
    
    const selectedFile = e.target.files[0];
    console.log(selectedFile)
   
    setFile(selectedFile);
      console.log(formData)
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({
            ...formData,
            "image": reader.result,
          });
        document.getElementById("image_button").style.display = "none"
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  const highlightText = (content) => {
    // You can customize the highlighting logic based on your requirements
    const highlightedValue = `<span style="background-color: yellow">${content}</span>`;
    
    // Set the highlighted value to a div or span
    return <div dangerouslySetInnerHTML={{ __html: highlightedValue }} />;
  };

  const handleSubmit = async () =>{
    try{

      let len = formData.description
      .replace(/<[^>]*>/g, ' ') // Remove HTML tags
      .split(/\s+/)
      .filter(Boolean)
      .length
      if(len<100)return;
      if(formData.name == '' || formData.description == ''){
        if(formData.name == '')document.getElementById("name_warn").style.display = "flex";
        return;
      }
       document.querySelectorAll(".article_form")[0].style.display = "none";
       document.querySelectorAll(".loading")[0].style.display = "flex";
       document.querySelectorAll(".footer")[0].style.display = "none";
       
        let form_data = formData
        let text = getPlainText(formData.description)
        console.log(text)
        form_data["file"]=file
        form_data["firebaseUid"] = userid
        form_data["username"] = user.username
        console.log(form_data)
        let check_form_photo = {
          "image" : formData.image
        }
        let check_form_name = {
          "description" : formData.name
        }
        let check_form = {
          "description" : text
        }
        if(formData.image == ""){
         
        }
        // const check_img = await axios.post('https://speak-flask-img-api.onrender.com/image_filter',check_form_photo)
        const check_name = await axios.post('https://speak-flask-text-api.onrender.com/simple',check_form_name)
        const check_descp = await axios.post('https://speak-flask-text-api.onrender.com/simple',check_form)

        let name = check_name.data.message
        let descp = check_descp.data.message
        let class_label = 1
        console.log(descp)
        console.log(class_label)
        if(class_label == 0 ||  class_label ==2){
          document.querySelectorAll(".loading")[0].style.display = "none";
          document.querySelectorAll(".blackscreen_warning")[0].style.display = "block" 
          document.getElementById("ar_img").style.display = "flex" 
        }
        if(name.length>0){
          document.querySelectorAll(".loading")[0].style.display = "none";
             document.querySelectorAll(".blackscreen_warning")[0].style.display = "block" 
             document.getElementById("ar_name").style.display = "block" 
            
            
             
        }
        if(descp.length>0){
          document.querySelectorAll(".loading")[0].style.display = "none";
          document.querySelectorAll(".blackscreen_warning")[0].style.display = "block" 
          document.getElementById("ar_descp").style.display = "block" 
          let descp_p = document.getElementById("descp_ml");
          document.getElementById("descp_ml").innerHTML = "";
          let text = getPlainText(formData.description).split('.')
          let defined = formData.description.split('.')
          let itr = 0;
          text.map((elem,idx)=>{
            let spanElem = document.createElement('span')
            spanElem.style.backgroundColor = "#fdeb37"
            spanElem.textContent= elem+"."
            console.log(idx)
            if(idx === descp[itr]){
              <span style={{backgroundColor:"#fdeb37"}}>{formData.name}</span>
              console.log(defined[idx])
              defined[idx] = "<span style='background-color:#fdeb37'>"+defined[idx]+"</span>"
              descp_p.append(spanElem)
              itr++;
             
            }
            else{
              spanElem.style.backgroundColor = ""
              descp_p.append(spanElem)
              
            }

           
            
          })

          let final_def = defined.join('.')
          console.log(final_def)
          handleEditorChange(final_def)


          
            
          
         

     }
     if(name.length>0 || descp.length>0 || class_label == 0 ||  class_label ==2)return;

        let article = await axios.post('https://speakserver.onrender.com/db/addArticles',form_data,{
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
    console.log(name,value)
    if(name === "name" && value===''){
      console.log("hi there")
      document.getElementById("article_name").style.backgroundColor = "white"
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const getPlainText = (html) => {
    // Create a temporary element to parse the HTML content
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    // Extract the text content
    return tempElement.textContent || tempElement.innerText || '';
  };
  const handleEditorChange = (content) => {
    setFormData({
      ...formData,
      "description": content,
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
        
           <div className="loading_page">
              <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
           </div>
       
    )
}
return (
  <div>
   <div className="blackscreen_warning">
     <div className="warning_ml">
       <p className="warn_header"><i class="fa-solid fa-triangle-exclamation"></i><br></br>There was some innappropriate content detected in your article</p>
     </div>
     <div id="ar_img">
    
          <img src={formData.image} style={{height:"250px",width:"auto"}}></img>
     </div>
     <div id="ar_name">
          <h4>Article Name</h4>
          <span style={{backgroundColor:"#fdeb37"}}>{formData.name}</span>
     </div>
     <div id="ar_descp">
        <h4>Article Description</h4>
        <div id="descp_ml"></div>
     </div>
     <div id="ar_button">
        <button onClick={()=>{
          document.querySelectorAll(".blackscreen_warning")[0].style.display="none"
          document.querySelectorAll("#ar_name")[0].style.display="none"
          document.querySelectorAll("#ar_descp")[0].style.display="none"
          document.querySelectorAll(".article_form")[0].style.display = "flex";
          document.querySelectorAll(".footer")[0].style.display = "flex";
          
        }} className="make_change">Make Changes</button>
     </div>
    
   </div>
  
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
         </div>
        
         <div onClick={handleButtonClick} className="img_div" htmlFor="upload" style={{ backgroundImage: `url(${formData.image})` }}>
         <input ref={fileInputRef} style={{display:"none"}}  type="file" name="file" onChange={handleImageChange}  id="upload" accept="image/png, image/jpg, image/jpeg"></input>
         <div id="image_button">

         
         
         Select Image File
         </div>
        </div>
       
        <div className="article_name_descp">
          <p>Article Name</p>
           <input id="article_name" value={formData.name}  type="type" name="name" onChange={handleChange}></input>
           <p id= "name_warn" style={{display:"none",color:"red"}}>
          Article Name field is empty
          </p>
           <RichTextEditor editorContent={formData.description} setEditorContent={handleEditorChange} />
           <button onClick={handleSubmit} className="submit">Create Post</button>
          
       </div>
       
       {/* <div dangerouslySetInnerHTML={{ __html: formData.description }} /> */}


   </div>
   <div className="loading">
     Creating Post
     <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
   </div>
   
    </div>

    </div>
    
  </div>
)


}



