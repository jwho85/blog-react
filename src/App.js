import './App.css';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Reset from "./components/Reset";
import Dashboard from "./components/Dashboard";
import ViewPosts from './components/ViewPosts';
import CreatePost from "./components/CreatePost";
import EditPost from "./components/EditPost";
import Profile from './components/Profile';

function App() {

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/create-post" element={<CreatePost />} />
          <Route exact path="/edit-post/:id" element={<EditPost />} />
          <Route exact path="/profile/:id" element={<Profile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
