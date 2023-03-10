import './App.css';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Reset from "./components/Reset";
import Dashboard from "./components/Dashboard";
import CreatePost from "./components/CreatePost";
import EditPost from "./components/EditPost";
import Profile from './components/Profile';
import Menu from "./components/Menu";
import Footer from "./components/Footer";

export default function App() {

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
          <Route exact path="/profile" element={<Profile />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}
