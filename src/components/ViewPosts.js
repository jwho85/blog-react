import React, { useEffect, useState, useRef } from "react";
import "./Draft.css";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { collection, doc, addDoc, getDoc, updateDoc, deleteDoc, Timestamp, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "./utils/firebase";
import DOMPurify from 'dompurify';
import { Link } from "react-router-dom";

export default function ViewPosts() {

    const [posts, setPosts] = useState([]);
    const [user, loading, error] = useAuthState(auth);

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

    //function for sorting posts after they are filtered
    function sortTasks(array) {
        array.sort((a, b) => (a.data.created > b.data.created ? -1 : 1));
        return array;
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
        <div>
            <div>
                {sortTasks(posts).map(post => (
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
                        <div
                            className="post-body"
                            dangerouslySetInnerHTML={createMarkup(post.data.body)}>
                        </div>
                        <img
                            className="post-image"
                            src={`${post.data.image}`}
                        />
                        <br></br><br></br>
                        <Link to={"/edit-post/" + post.id}>
                            <button
                            >
                                Edit
                            </button>
                        </Link>
                        <button
                            onClick={() => handleDuplicate(post.id)}
                        >
                            Duplicate
                        </button>
                        <button
                            onClick={() => handleDelete(post.id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div >
    );
};