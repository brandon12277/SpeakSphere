import {React,useEffect,useState} from 'react';
import ReactDOM from 'react-dom/client';
import "../css/signUp.css"
import { Navbar } from './navbar';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import axios from "axios"
import { useNavigate } from 'react-router-dom';




export function SignUpPage(){
   


 
  

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    
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

  const handleSignup = async () => {
    try {
       
      
      axios.post('http://localhost:3000/db/ValidateNewUser',formData)
      .then(async (res)=>{
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password);
        const user = userCredential.user;
     console.log(userCredential)
        const form_data = {
          username : formData.username,
          name : formData.name,
          email : formData.email,
          password : formData.password,
          phone : formData.phone,
          firebaseUid  : user.uid
        }
        axios.post('http://localhost:3000/db/createUser', form_data)
        .then((response)=>{
          console.log(response.data)
          localStorage.setItem('token', user.uid);
            localStorage.setItem('isauth', true);
          navigate("/Account")
        })
        .catch(err=>{
          console.log(err)
          document.getElementById("error").innerHTML = err.data
        })
       
        
      })
      .catch(async err=>{
        console.log(err)
        if(err.response)
        document.getElementById("error").innerHTML =err.response.data
        else
        document.getElementById("error").innerHTML = "The email address is already in use by another account."

       
      })
     
       
      
      

     
    } catch (error) {
      console.log(error)
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
       
        
        axios.post('http://localhost:3000/db/createUser', form_data)
        .then((res)=>{
          localStorage.setItem('token', user.uid);
          localStorage.setItem('isauth', true);
        navigate("/Account")
        })
        .catch(err=>{
          localStorage.setItem('token', user.uid);
        localStorage.setItem('isauth', true);
          navigate("/Account")
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
                    <h1 className="SignUp_text">Sign Up</h1>
                    <p className="non-highlight">Create a free Account</p>
                     
                    <div className="form-container">
                      <p id="error"></p>
      <div className="input-container">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

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
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      <div className="input-container">
        <label htmlFor="mobile">Mobile Number</label>
        <input
          type="tel"
          id="mobile"
          name="phone"
          value={formData.phone}
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

      <div className="input-container">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          
          // onChange={}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      <button className="signup" type="button" onClick={handleSignup}>
       Sign up
      </button>
    </div>
    <div className="legend"><hr></hr><p className="non-highlight">Or Sign In using</p><hr></hr></div>
    <div className="socials">
       <button className="signup" onClick={loginWithGoogle }><i class="fa-brands fa-google"></i> Google</button>
       
      

    </div>
   
    
  </div>
</div>
     )
}