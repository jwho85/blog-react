import React, { useEffect, useState, useRef } from "react";
import "./Draft.css";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, Timestamp, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "./utils/firebase";
import { storage } from "./utils/firebase";
import {
    ref,
    uploadBytesResumable,
    getDownloadURL
} from "firebase/storage";
import { EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import Menu from "./Menu";
import { useParams } from "react-router-dom";
import htmlToDraft from 'html-to-draftjs';

export default function EditPost() {

    const [formData, setFormData] = useState({
        title: "",
        body: "",
        image: "",
    })
    const [file, setFile] = useState("");
    const [percent, setPercent] = useState(0);
    const [imageURL, setImageURL] = useState("");
    const [post, setPost] = useState([]);

    const { id } = useParams();

    //Draft.js code

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );

    const [convertedContent, setConvertedContent] = useState(null);

    //function for converting the HTML back to text
    const htmlToDraftBlocks = (html) => {
        const blocksFromHtml = htmlToDraft(html);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        const editorState = EditorState.createWithContent(contentState);
        return editorState;
    }

    //function for converting post body to HTML
    useEffect(() => {
        let html = convertToHTML(editorState.getCurrentContent());
        setConvertedContent(html);
        setFormData({ ...formData, body: convertedContent });
    },);

    //function for setting the image to the image URL
    useEffect(() => {
        setFormData({ ...formData, image: imageURL });
    }, [imageURL]);

    //END

    //Image upload code

    function handleImageChange(event) {
        setFile(event.target.files[0]);
        // setFormData({ ...formData, image: event.target.files[0].name });
    }

    const handleUpload = () => {
        if (!file) {
            alert("Please upload an image first!");
        }

        const storageRef = ref(storage, `/files/${file.name}`);

        // progress can be paused and resumed. It also exposes progress updates.
        // Receives the storage reference and the file to upload.
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );

                // update progress
                setPercent(percent);
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    console.log(url);
                    const urlToString = url.toString();
                    console.log(urlToString);
                    setImageURL(urlToString);
                    console.log(imageURL);
                });
            }
        );
    };

    //END

    //Get post code

    //function for getting the post
    useEffect(() => {
        const getPost = async () => {
            const docRef = doc(db, 'posts', id);
            try {
                const docSnap = await getDoc(docRef);
                setPost(docSnap.data());
                setFormData({ ...formData, title: post.title });
                setEditorState(htmlToDraftBlocks(post.body));
            } catch (error) {
                console.log(error)
            }
        };
        getPost();
        return () => {
            // this now gets called when the component unmounts
        };
    }, [id, post.body]);

    //END

    //Submit form code

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.title === "") {
            alert("Please enter a title");
            return;
        }
        if (formData.body === "") {
            alert("Please enter some body copy");
            return;
        }
        const postDocRef = doc(db, 'posts', id);
        try {
            await updateDoc(postDocRef, {
                title: formData.title,
                body: formData.body,
                image: formData.image,
                created: Timestamp.now(),
            })
            alert("Post updated successfully!")
        } catch (err) {
            alert(err)
        }
    }

    //END

    return (
        <div>
            <Menu />
            <div>
                <div>
                    <h1>Blog App</h1>
                </div>
                <form onSubmit={handleSubmit}>

                    <input
                        name="title"
                        type="text"
                        placeholder="Title"
                        defaultValue={post.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <br></br>
                    <br></br>

                    <Editor
                        editorState={editorState}
                        onEditorStateChange={setEditorState}
                        wrapperClassName="wrapper-class"
                        editorClassName="editor-class"
                        toolbarClassName="toolbar-class"
                    />

                    <br></br>
                    <br></br>
                    <input
                        value=""
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <button
                        type="button"
                        value="Upload Image"
                        onClick={handleUpload}
                    >Upload Image</button>
                    <p>{percent} % uploaded</p>
                    <br></br>
                    <br></br>
                    <button
                        type="submit"
                    >Submit</button>

                </form>
            </div>
        </div >
    );
};