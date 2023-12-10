import {React,useEffect,useState} from 'react';
import "../css/signUp.css"
import { Navbar } from './navbar';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';





export function Login(){
   
  

  const navigate = useNavigate();
  const url = localStorage.getItem('url')
  const [formData, setFormData] = useState({
    
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFocus = (e) => {
    const inputContainer = e.target.closest('.input-container');
    inputContainer.classList.add('focus');
  };

  const handleBlur = (e) => {
    const inputContainer = e.target.closest('.input-container');
    if (e.target.value === '') {
      inputContainer.classList.remove('focus');
    }
  };

  const handleLogin = async () => {
    
    document.querySelectorAll(".signup")[0].style.display = "none"; 
    document.querySelectorAll(".onload")[0].style.display = "block"; 
    try {
      axios.post('https://speakserver.onrender.com/db/ValidateUser',formData)
      .then(async (res)=>{
        console.log(res)
      const userCredential = await firebase.auth().signInWithEmailAndPassword(res.data.email, res.data.password);
      const user = userCredential.user;
      localStorage.setItem('token', user.uid);
      localStorage.setItem('isauth', true);
      console.log(url)
      document.querySelectorAll(".signup")[0].style.display = ""; 
      document.querySelectorAll(".onload")[0].style.display = "none"; 
      if(!url)
      navigate("/")
    else
    navigate(url)
   
    localStorage.removeItem('url')

      })
      .catch(err=>{
        document.querySelectorAll(".signup")[0].style.display = ""; 
    document.querySelectorAll(".onload")[0].style.display = "none"; 
        document.getElementById("error").innerHTML = "Wrong Username or Password"
      })

      
      
    } catch (error) {
      document.querySelectorAll(".signup")[0].style.display = ""; 
    document.querySelectorAll(".onload")[0].style.display = "none"; 
      document.getElementById("error").innerHTML = "Wrong Username or Password"
    }
  };

  const loginWithGoogle = async () => {
    try {
      
     
		firebase
			.auth()
			.signInWithPopup(new firebase.auth.GoogleAuthProvider())
			.then(async (userCredential) => {
				if (userCredential) {
					const user = userCredential.user;
        
         
        
        
        
        const form_data = {
          username : userCredential.user.email.split('@')[0],
          name : userCredential.user.displayName,
          email : userCredential.user.email,
          firebaseUid  : user.uid
        }
        
        console.log(form_data)
       
        
        axios.post('https://speakserver.onrender.com/db/createUser', form_data)
        .then((res)=>{
          localStorage.setItem('token', user.uid);
          localStorage.setItem('isauth', true);
           if(!url)
      navigate("/")
    else
    navigate(url)
        })
        .catch(err=>{
          localStorage.setItem('token', user.uid);
        localStorage.setItem('isauth', true);
             if(!url)
           navigate("/")
          else
          navigate(url)
        })
        
         
				}
			});
      
      
    }
    catch (error) {
      document.getElementById("error").innerHTML = "Error has occured while signing in "
    }

	};

     return (
        <div className = "container">
            <Navbar/>
                <div className = "sign_up_cont">
                    <h1 className="SignUp_text">Log in</h1>
                     
                    <div className="form-container">
     
     <p id="error"></p>
      <div className="input-container">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      


      <div className="input-container">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>


      <button className="signup" type="button" onClick={handleLogin}>
      Log in
      </button>
      <div className="onload">
      
              <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
           
      </div>
      <div className="legend"><hr></hr><p className="non-highlight">Or Sign In using</p><hr></hr></div>
    <div className="socials">
       <button className="signup" onClick={loginWithGoogle }><i class="fa-brands fa-google"></i> Google</button>
       
      

    </div>
    </div>
   
    
  </div>
  
</div>
     )
}