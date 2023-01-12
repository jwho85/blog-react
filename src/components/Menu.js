import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, logout } from "./utils/firebase";
import { collection, doc, addDoc, updateDoc, deleteDoc, Timestamp, query, orderBy, onSnapshot, getDocs, where } from "firebase/firestore";

export default function Menu() {

    const [user, loading, error] = useAuthState(auth);

    return (
        <div className="container">
            <div className="dashboard">
                <div className="dashboard__container">
                    Logged in as:
                    <div>{user?.displayName}</div>
                    <div>{user?.email}</div>
                    <br></br>
                    <Link to="/dashboard">
                        <button
                            type="button"
                        >
                            View Posts
                        </button>
                    </Link>
                    <Link to="/create-post">
                        <button
                            type="button"
                        >
                            Create Post
                        </button>
                    </Link>
                    <br></br>
                    <button className="dashboard__btn" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}