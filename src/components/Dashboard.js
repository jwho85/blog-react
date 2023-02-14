import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import "./Draft.css";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import DOMPurify from 'dompurify';
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, logout } from "./utils/firebase";
import { collection, doc, addDoc, getDoc, updateDoc, deleteDoc, Timestamp, query, orderBy, onSnapshot, getDocs, where } from "firebase/firestore";
import Menu from "./Menu";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

export default function Dashboard() {

    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    const [posts, setPosts] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [filteredPosts, setFilteredPosts] = useState([]);

    const [backgroundColor, setBackgroundColor] = useState("");
    const [postColor, setPostColor] = useState("");
    const [fontColor, setFontColor] = useState("");
    const [fontFamily, setFontFamily] = useState("");
    const [showOptions, setShowOptions] = useState(false);

    const [userInfo, setUserInfo] = useState("");
    const [userDocID, setUserDocID] = useState("");
    const [userBackgroundColor, setUserBackgroundColor] = useState("");
    const [userPostColor, setUserPostColor] = useState("");
    const [userFontColor, setUserFontColor] = useState("");
    const [userFontFamily, setUserFontFamily] = useState("");

    const navigate = useNavigate();

    //function to check for user
    useEffect(() => {
        if (loading) {
            return;
        }
        if (!user) navigate("/");
    }, [user, loading]);

    //function for automatically retrieving user
    useEffect(() => {
        const q = query(collection(db, 'users'), where("uid", "==", user?.uid));
        onSnapshot(q, (querySnapshot) => {
            setUserInfo(querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
        })
    }, [])

    //function for automatically retrieving posts
    useEffect(() => {
        const q = query(collection(db, 'posts'), where("uid", "==", user?.uid));
        onSnapshot(q, (querySnapshot) => {
            setPosts(querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
        })
    }, [])

    //function for setting user post options
    useEffect(() => {
        setName(userInfo[0]?.data.name);
        setUserDocID(userInfo[0]?.id);
        setUserBackgroundColor(userInfo[0]?.data.backgroundColor);
        setUserPostColor(userInfo[0]?.data.postColor);
        setUserFontColor(userInfo[0]?.data.fontColor);
        setUserFontFamily(userInfo[0]?.data.fontFamily);
    })

    //function for sanitizing HTML
    function createMarkup(html) {
        return {
            __html: DOMPurify.sanitize(html)
        }
    }

    //function for getting the value of the search input
    function handleSearchChange(e) {
        e.preventDefault();
        setSearchInput(e.target.value)
    }

    //function for loading filtered posts
    useEffect(() => {
        setFilteredPosts(posts
            .filter(post => post.data.title.match(searchInput) ||
                post.data.title.toLowerCase().match(searchInput) ||
                post.data.body.match(searchInput) ||
                post.data.body.toLowerCase().match(searchInput) ||
                convertTimestamp(post.data.created).match(searchInput) ||
                convertTimestamp(post.data.created).toLowerCase().match(searchInput))
        );
    }, [posts, searchInput])

    //function for changing timestamp back to string
    function convertTimestamp(timestamp) {
        const date = timestamp.toDate().toDateString();
        const time = timestamp.toDate().toLocaleTimeString('en-US');
        return date + " at " + time;
    }

    //function for duplicating a post
    const handleDuplicate = async (id) => {
        const docRef = doc(db, 'posts', id);
        try {
            const docSnap = await getDoc(docRef);
            const currentPost = docSnap.data();
            await addDoc(collection(db, 'posts'), {
                title: currentPost.title + " Copy",
                body: currentPost.body,
                image: currentPost.image,
                created: Timestamp.now(),
                uid: user?.uid,
            })
            alert("Post duplicated successfully!")
        } catch (error) {
            console.log(error)
        }
    }

    //function for deleting a post
    const handleDelete = async (id) => {
        const response = window.confirm("Are you sure you want to delete this post?");
        if (response) {
            const postDocRef = doc(db, 'posts', id)
            try {
                await deleteDoc(postDocRef)
            } catch (err) {
                alert(err)
            }
        }
    }

    //function for sorting posts after they are filtered
    function sortPosts(array) {
        array.sort((a, b) => (a.data.created > b.data.created ? -1 : 1));
        return array;
    }

    //function for updating background color
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

    //function for updating post color
    const handlePostColorChange = async (color, userDocID) => {
        setPostColor(color);
        const userDocRef = doc(db, 'users', userDocID);
        try {
            await updateDoc(userDocRef, {
                postColor: color,
            })
            console.log("Post color updated");
        } catch (err) {
            alert(err)
        }
    };

    //function for updating font color
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

    //function for updating font family
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

    //function for resetting blog styling
    const resetStyles = () => {
        handleBackgroundColorChange("white", userDocID);
        handlePostColorChange("#efefef", userDocID);
        handleFontColorChange("black", userDocID);
        handleFontFamilyChange("inherit", userDocID);
        setShowOptions(!showOptions);
        console.log("Reset button clicked");
    }

    //function for showing blog styling options
    const handleShowOptions = () => {
        setShowOptions(!showOptions);
    }

    return (
        <div className="dash-board">
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
                    <div>
                        <div>
                            <h5>Search for a post by keyword</h5>
                            <input
                                id="search-bar"
                                type="text"
                                value={searchInput}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <br></br>
                        <input type="submit" value="Post Options" onClick={handleShowOptions} />
                        {showOptions &&
                            <div>
                                <br></br>
                                <input
                                    className="change-background"
                                    type="color"
                                    defaultValue={userBackgroundColor}
                                    onChange={(e) => setBackgroundColor(e.target.value)}
                                />
                                <button
                                    className="view-post-button"
                                    onClick={() => handleBackgroundColorChange(backgroundColor, userDocID)}
                                >
                                    Change background color
                                </button>
                                <br></br><br></br>
                                <input
                                    className="change-background"
                                    type="color"
                                    defaultValue={userPostColor}
                                    onChange={(e) => setPostColor(e.target.value)}
                                />
                                <button
                                    className="view-post-button"
                                    onClick={() => handlePostColorChange(postColor, userDocID)}
                                >
                                    Change post color
                                </button>
                                <br></br><br></br>
                                <input
                                    className="change-background"
                                    type="color"
                                    defaultValue={userFontColor}
                                    onChange={(e) => setFontColor(e.target.value)}
                                />
                                <button
                                    className="view-post-button"
                                    onClick={() => handleFontColorChange(fontColor, userDocID)}
                                >
                                    Change font color
                                </button>
                                <br></br><br></br>
                                <select
                                    className="change-background"
                                    type="text"
                                    defaultValue={userFontFamily}
                                    onChange={(e) => setFontFamily(e.target.value)}
                                >
                                    <option value="arial">Arial</option>
                                    <option value="verdana">Verdana</option>
                                    <option value="tahoma">Tahoma</option>
                                    <option value="trebuchet ms">Trebuchet MS</option>
                                    <option value="times new roman">Times New Roman</option>
                                    <option value="georgia">Georgia</option>
                                    <option value="garamond">Garamond</option>
                                    <option value="courier new">Courier New</option>
                                    <option value="brush script mt">Brush Script MT</option>
                                </select>
                                <button
                                    className="view-post-button"
                                    onClick={() => handleFontFamilyChange(fontFamily, userDocID)}
                                >
                                    Change font family
                                </button>
                                <br></br><br></br>
                                <button
                                    className="view-post-button"
                                    onClick={() => resetStyles()}
                                >
                                    Reset styles
                                </button>
                            </div>
                        }
                        {sortPosts(filteredPosts).map(post => (
                            <div
                                style={{ backgroundColor: `${userPostColor}` }}
                                className="single-post"
                                id={post.id}
                                key={post.id}
                            >
                                <h2
                                    className="post-title"
                                >
                                    {post.data.title}
                                </h2>
                                <h5>{convertTimestamp(post.data.created)}</h5>
                                <div
                                    className="post-body"
                                    dangerouslySetInnerHTML={createMarkup(post.data.body)}>
                                </div>
                                <img
                                    className="post-image"
                                    src={`${post.data.image}`} />
                                <br></br><br></br>
                                <Link to={"/edit-post/" + post.id}>
                                    <button
                                        className="view-post-button"
                                    >
                                        Edit
                                    </button>
                                </Link>
                                <button
                                    className="view-post-button"
                                    onClick={() => handleDuplicate(post.id)}
                                >
                                    Duplicate
                                </button>
                                <button
                                    className="view-post-button"
                                    onClick={() => handleDelete(post.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </Container>
            </div>
        </div>
    );
}