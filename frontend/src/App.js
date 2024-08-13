import React from "react"
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LandingPage } from "./components/landingPage";
import { SignUpPage } from "./components/signup";
import { Login } from "./components/login";

import { NewArticle } from "./components/new_article";

import { UserPostPage } from "./components/userPostPage";
import { Article } from "./components/ArticleDisplay";


import Footer from "./components/Footer";
import { UpdateArticle } from "./components/Update_Article";

function App() {
  return (
    <div className="App">
      <Router>
       <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Register" element={<SignUpPage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/NewArticle" element={<NewArticle/>} />
        <Route path="/my-posts" element={<UserPostPage/>} />
        <Route path="/:article/:id" element={<Article/>} />
        <Route path="my-posts/UpdateArticle/:article/:id" element={<UpdateArticle/>} />
        
       </Routes>
    </Router>
   
    </div>
  );
}

export default App;
