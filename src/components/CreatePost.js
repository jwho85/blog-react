import React, { useEffect, useState, useRef } from "react";
import "./Draft.css";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { collection, doc, addDoc, updateDoc, deleteDoc, Timestamp, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "./utils/firebase";
import { storage } from "./utils/firebase";
import {
    ref,
    uploadBytesResumable,
    getDownloadURL
} from "firebase/storage";
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML } from 'draft-convert';
import Menu from "./Menu";
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';

export default function CreatePost() {

    const [user, loading, error] = useAuthState(auth);
    const [formData, setFormData] = useState({
        title: "",
        body: "",
        image: "",
    })
    const [file, setFile] = useState("");
    const [percent, setPercent] = useState(0);
    const [imageURL, setImageURL] = useState("");
    const navigate = useNavigate();

    //Draft.js code

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );

    const [convertedContent, setConvertedContent] = useState(null);

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
                    const urlToString = url.toString();
                    setImageURL(urlToString);

                });
            }
        );
    };

    //END

    //Submit form code

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.title === "") {
            alert("Please enter a title");
            return;
        }
        if (formData.body === "") {
            alert("Please enter some body copy");
            return;
        }
        try {
            await addDoc(collection(db, 'posts'), {
                title: formData.title,
                body: formData.body,
                image: formData.image,
                created: Timestamp.now(),
                uid: user?.uid,
            })
            alert("Post created successfully!")
            navigate("/dashboard");
        } catch (err) {
            alert(err)
        }
    }

    //END

    return (
        <div>
            <Menu />
            <Container className="container-top-padding create-post">
                <div>
                    <h1>Create Post</h1>
                </div>
                <form onSubmit={handleSubmit}>

                    <input
                        name="title"
                        type="text"
                        placeholder="Title"
                        value={formData.title}
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
                        placeholder="Content"
                    />

                    <br></br>
                    Featured image:
                    <br></br>
                    <br></br>
                    <img
                        className="post-image"
                        src={`${imageURL}`}
                    />
                    <br></br>
                    <br></br>
                    <input
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
            </Container>
        </div >
    );
};