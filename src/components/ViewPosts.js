import React, { useEffect, useState, useRef } from "react";
import "./Draft.css";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { collection, doc, addDoc, getDoc, updateDoc, deleteDoc, Timestamp, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "./utils/firebase";
import DOMPurify from 'dompurify';
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

const ViewPosts = props => {

    const [posts, setPosts] = useState([]);
    const [user, loading, error] = useAuthState(auth);
    const [searchInput, setSearchInput] = useState("");
    const [filteredPosts, setFilteredPosts] = useState([]);

    const [color, setColor] = useState("");

    //function for sanitizing HTML
    function createMarkup(html) {
        return {
            __html: DOMPurify.sanitize(html)
        }
    }

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

    //function for sorting posts after they are filtered
    function sortPosts(array) {
        array.sort((a, b) => (a.data.created > b.data.created ? -1 : 1));
        return array;
    }

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

    return (
        <Container>
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
                <input
                    className="change-background"
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                />
                <button
                    className="view-post-button"
                    onClick={() => props.onColorChange(color)}
                >
                    Change background
                </button>
                {sortPosts(filteredPosts).map(post => (
                    <div
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
    );
};

export default ViewPosts;