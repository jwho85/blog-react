import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, logout } from "./utils/firebase";
import { collection, doc, addDoc, updateDoc, deleteDoc, Timestamp, query, orderBy, onSnapshot, getDocs, where } from "firebase/firestore";
import ViewPosts from "./ViewPosts";
import Menu from "./Menu";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

export default function Dashboard() {

    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    const fetchUserName = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            setName(data.name);
        } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data");
        }
    };

    useEffect(() => {
        if (loading) {
            return;
        }
        if (!user) navigate("/");
        fetchUserName();
    }, [user, loading]);

    //function for automatically retrieving items
    useEffect(() => {
        const q = query(collection(db, 'posts'), where("uid", "==", user?.uid));
        onSnapshot(q, (querySnapshot) => {
            setPosts(querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
        })
    }, [])

    return (
        <div>
            <Menu />
            <Container className="container-top-padding">
                <h1>Welcome back {name}!</h1>
                <p>You have {posts.length} posts.</p>
            </Container>
            <ViewPosts />
        </div>
    );
}