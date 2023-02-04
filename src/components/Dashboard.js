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

    const [backgroundColor, setBackgroundColor] = useState("");
    const [fontColor, setFontColor] = useState("");
    const [fontFamily, setFontFamily] = useState("");
    const [userInfo, setUserInfo] = useState("");

    const [userDocID, setUserDocID] = useState("");
    const [userBackgroundColor, setUserBackgroundColor] = useState("");
    const [userPostColor, setUserPostColor] = useState("");
    const [userFontColor, setUserFontColor] = useState("");
    const [userFontFamily, setUserFontFamily] = useState("");

    const userID = auth.currentUser.uid;

    //function for automatically retrieving user
    useEffect(() => {
        const q = query(collection(db, 'users'), where("uid", "==", userID));
        onSnapshot(q, (querySnapshot) => {
            setUserInfo(querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
        })
    }, [])

    useEffect(() => {
        setUserDocID(userInfo[0]?.id);
        setUserBackgroundColor(userInfo[0]?.data.backgroundColor);
        setUserPostColor(userInfo[0]?.data.postColor);
        setUserFontColor(userInfo[0]?.data.fontColor);
        setUserFontFamily(userInfo[0]?.data.fontFamily);
    })

    const handleBackgroundColorChange = async (color, userDocID) => {
        setBackgroundColor(color);
        const userDocRef = doc(db, 'users', userDocID);
        try {
            await updateDoc(userDocRef, {
                backgroundColor: color,
            })
            console.log("Background color updated");
        } catch (err) {
            alert(err)
        }
    };

    const handleFontColorChange = async (color, userDocID) => {
        setFontColor(color);
        const userDocRef = doc(db, 'users', userDocID);
        try {
            await updateDoc(userDocRef, {
                fontColor: color,
            })
            console.log("Font color updated");
        } catch (err) {
            alert(err)
        }
    }

    const handleFontFamilyChange = async (font, userDocID) => {
        setFontFamily(font);
        const userDocRef = doc(db, 'users', userDocID);
        try {
            await updateDoc(userDocRef, {
                fontFamily: font,
            })
            console.log("Font family updated");
        } catch (err) {
            alert(err)
        }
    }

    const fetchUserName = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            setName(data.name);
        } catch (err) {
            console.error(err);
            // alert("An error occured while fetching user data");
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
            <div className="bottom-padding"
                style={{
                    background: `${userBackgroundColor}`,
                    color: `${userFontColor}`,
                    fontFamily: `${userFontFamily}`
                }}>
                <Container className="container-top-padding">
                    <h1>Welcome back {name}!</h1>
                    <p>You have {posts.length} posts.</p>
                </Container>
                <ViewPosts
                    handleBackgroundColorChange={handleBackgroundColorChange}
                    handleFontColorChange={handleFontColorChange}
                    handleFontFamilyChange={handleFontFamilyChange}
                />
            </div>
        </div>
    );
}