import {React,useEffect,useState} from 'react';
import ReactDOM from 'react-dom/client';
import "../css/signUp.css"
import { Navbar } from './navbar';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';




export function SignUpPage(){
   


 
  

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    
  });
  function validatePassword() {
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    var message = document.getElementById('passwordMatchMessage');

    var icon = document.createElement('span');
    
    if (password === confirmPassword) {
        icon.innerHTML = '✓ Passwords match';
        icon.className = 'valid';
    } else {
        icon.innerHTML = '✗ Passwords do not match';
        icon.className = 'invalid';
    }

    // Clear previous content
    message.innerHTML = '';

    // Append the icon to the message paragraph
    message.appendChild(icon);
}
  function formatPhoneNumber(phoneNumber) {
    return phoneNumber.replace(/(\d{4})(\d{3})(\d{3})/, '$1-$2-$3');
}
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangePhone = (e) => {
    const { name, value } = e.target;
    var phoneNumber = value.replace(/\D/g, '');

    if (phoneNumber.length > 10) {
        phoneNumber = phoneNumber.slice(0, 10);
    }

    
    var formattedPhoneNumber = formatPhoneNumber(phoneNumber);

    
    e.value = formattedPhoneNumber;
    setFormData({
      ...formData,
      [name]: formattedPhoneNumber,
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
       
      document.querySelectorAll(".signup")[0].style.display = "none"; 
    document.querySelectorAll(".onload")[0].style.display = "block"; 
      axios.post('https://speakserver.onrender.com/db/ValidateNewUser',formData)
      .then(async (res)=>{
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password);
        const user = userCredential.user;
     console.log(userCredential)
        const form_data = {
          username : formData.username,
          name : formData.name,
          email : formData.email,
          password : formData.password,
          phoneg : formData.phone,
          firebaseUid  : user.uid
        }
        axios.post('https://speakserver.onrender.com/db/createUser', form_data)
        .then((response)=>{
          console.log(response.data)
          localStorage.setItem('token', user.uid);
            localStorage.setItem('isauth', true);
          navigate("/Account")
        })
        .catch(err=>{
          console.log(err)
          document.querySelectorAll(".signup")[0].style.display = ""; 
          document.querySelectorAll(".onload")[0].style.display = "none"; 
          document.getElementById("error").innerHTML = err.data
        })
       
        
      })
      .catch(async err=>{
        document.querySelectorAll(".signup")[0].style.display = ""; 
    document.querySelectorAll(".onload")[0].style.display = "none";  
        console.log(err)
        if(err.response || err){
          if(err.response)document.getElementById("error").innerHTML =err.response.data
          else
          document.getElementById("error").innerHTML =err
        }
        
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
       
        
        axios.post('https://speakserver.onrender.com/db/createUser', form_data)
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
          required
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
          required
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
          required
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
          maxlength="10"
          value={formData.phone}
          onChange={handleChangePhone}
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
          required
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
          required
          onChange={validatePassword}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
      <p id="passwordMatchMessage"></p>

      <button className="signup" type="button" onClick={handleSignup}>
       Sign up
      </button>
      <div className="onload">
      
              <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
           
      </div>
    </div>
    <div className="legend"><hr></hr><p className="non-highlight">Or Sign In using</p><hr></hr></div>
    <div className="socials">
       <button className="signup" onClick={loginWithGoogle }><i class="fa-brands fa-google"></i> Google</button>
       
      

    </div>
   
    
  </div>
  
</div>
     )
}