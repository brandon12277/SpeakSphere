import React from "react"
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LandingPage } from "./components/landingPage";
import { SignUpPage } from "./components/signup";
import { Login } from "./components/login";
import { UserHomePage } from "./components/userHomePage";
import { NewArticle } from "./components/new_article";
import { PostCard } from "./components/postCard";
import { UserPostPage } from "./components/userPostPage";

function App() {
  return (
    <div className="App">
      <Router>
       <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Register" element={<SignUpPage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Account" element={<UserHomePage />} />
        <Route path="/Account/NewArticle" element={<NewArticle/>} />
        <Route path="/Account/my-posts" element={<UserPostPage/>} />
        
       </Routes>
    </Router>
    </div>
  );
}

export default App;
