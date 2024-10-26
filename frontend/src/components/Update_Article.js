import {React,useEffect,useState,useRef} from 'react';
import axios from "axios"
import "../css/create_article.css"
import { UserNav } from './userNav';
import { useNavigate } from 'react-router-dom';

import { useParams } from 'react-router-dom';
import RichTextEditor from './RichTextEditor';
import Footer from './Footer';

export function UpdateArticle(){
    
    const userid = localStorage.getItem('token')
    const isauth = localStorage.getItem('isauth')

    const [blackscreen,setBlack] = useState(null)
    const [loader,setLoader] = useState(null)

    let{ article, id } = useParams();
    const navigate = useNavigate();
   console.log(isauth)
   const fileInputRef = useRef(null);
   const [inputVal,setVal] = useState("")
    const [user,setuser] = useState("");
    const [file,setFile] = useState(null)
    const [ post,setPost] = useState(null)
    
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
            console.log(id)
            let userCred;
            if(userid){
               userCred = await axios.get('https://speakserver.onrender.com/db/FindUser?userid='+userid)
               setuser(userCred.data)
            }
            
            let article = await axios.get('https://speakserver.onrender.com/db/FindArticle?id='+id)

           

            if(article.data.username !== userCred.data.username){
                navigate("/")
                return;
            }
           
            console.log(article.data.description);

            // Combine all state updates into a single call
            setFormData({
              description: article.data.description,
              name: article.data.article_name,
              image: article.data.article_img
            });

          
            
     
         }
         catch(err){
           console.log(err)
         }
     }
 const handleImageChange = (e) => {

    console.log(formData)
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
//   const highlightText = (content) => {
//     // You can customize the highlighting logic based on your requirements
//     const highlightedValue = `<span style="background-color: yellow">${content}</span>`;
    
//     // Set the highlighted value to a div or span
//     return <div dangerouslySetInnerHTML={{ __html: highlightedValue }} />;
//   };

  const handleSubmit = async () =>{
    try{

      let len = formData.description
      .replace(/<[^>]*>/g, ' ') 
      .split(/\s+/)
      .filter(Boolean)
      .length
      if(len<100)return;
      if(formData.name == '' || formData.description == ''){
        if(formData.name == '')document.getElementById("name_warn").style.display = "flex";
        return;
      }
       document.querySelectorAll(".article_form")[0].style.display = "none";
       setLoader(1)
   
       
        let form_data = formData
        let text = getPlainText(formData.description)
        console.log(text)
        
        form_data["firebaseUid"] = userid
        form_data["username"] = user.username
        console.log(form_data)
        console.log(file)
       const formImg = new FormData()
       
       
       
        
        let check_form_name = {
          "description" : formData.name
        }
        let check_form = {
          "description" : text
        }
        if(formData.image == ""){
         
        }
        let check_img = null
        if(file){
        formImg.append('image', file);
        check_img = await axios.post('https://speak-flask-img-api.onrender.com/image_filter',formImg)
        }
        const check_name = await axios.post('https://speak-flask-text-api.onrender.com/simple',check_form_name)
        const check_descp = await axios.post('https://speak-flask-text-api.onrender.com/simple',check_form)

       



        let name = check_name.data.message
        let descp = check_descp.data.message
        let class_label = !check_img ? 1 : check_img.data.class


        console.log(descp)
        console.log(class_label)
        if(class_label == 0 ||  class_label ==2){
          setLoader(null)
          setBlack(1) 
          document.getElementById("ar_img").style.display = "flex" 
        }
        if(name.length>0){
            setLoader(null)
            setBlack(1)  
             document.getElementById("ar_name").style.display = "block" 
            
            
             
        }
        if(descp.length>0){
          setLoader(null)
          setBlack(1)  
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

    
      console.log(formData)
        let article = await axios.post('https://speakserver.onrender.com/db/updateArticle/'+id,formData)
        if(article.data){
            console.log(article.data)
            navigate("/")
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

 useEffect( ()=>{
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

    {
        blackscreen?
    
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
          setBlack(null)
          document.querySelectorAll("#ar_name")[0].style.display="none"
          document.querySelectorAll("#ar_descp")[0].style.display="none"
          document.querySelectorAll(".article_form")[0].style.display = "flex";
         
          
        }} className="make_change">Make Changes</button>
     </div>
    
   </div>
   :
   <></>
}

        
  
    <div className="homepage">
      <UserNav
         user = {user}
      />

<h1  className='' style={{ margin:"2%",fontFamily:"Montaga, serif"  }}>Update Post</h1>
    <div className="createArticle">
    <div className="article_form">
      

         <div className="design_bar">
           <div className="dots">
             <i class="fa-solid fa-circle"></i>
            <i class="fa-solid fa-circle"></i>
            <i class="fa-solid fa-circle"></i>
           </div>
         </div>
         {
            formData.image || formData.image == ""?

            <div onClick={handleButtonClick} className="img_div" htmlFor="upload" style={{ backgroundImage: `url(${formData.image})` }}>
            <input ref={fileInputRef} style={{display:"none"}}  type="file" name="file" onChange={handleImageChange}  id="upload" accept="image/png, image/jpg, image/jpeg"></input>
            <div id="image_button">
   
            
            
            Select Image File
            </div>
           </div>
           :
           <div class="lds-ring"><div></div><div></div><div></div><div></div></div>

         }
        
        
       
        <div className="article_name_descp">
          <p>Article Name</p>
          {
            formData.name ?
           <input id="article_name" value={formData.name}  type="type" name="name" onChange={handleChange}></input>
           :
           <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
          }
           <p id= "name_warn" style={{display:"none",color:"red"}}>
          Article Name field is empty
          </p>
           {
            formData.description ?
            <RichTextEditor editorContent={formData.description} setEditorContent={handleEditorChange} />
            :
            <div class="lds-ring"><div></div><div></div><div></div><div></div></div>

           }
          
           <button onClick={handleSubmit} className="submit">Update Post</button>
          
       </div>
       
     


   </div>
   {
    loader?
    <div className="loading">
     Updating Post
     <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
   </div>
   :
   <></>
   }
   
   
    </div>

    </div>
    
  </div>
)


}



