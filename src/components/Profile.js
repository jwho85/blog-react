import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, db, logout, sendPasswordReset } from "./utils/firebase";
import { collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, Timestamp, query, orderBy, onSnapshot, where } from "firebase/firestore";
import Menu from "./Menu";
import { updateProfile, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

export default function Profile() {

    const [name, setName] = useState("");
    const [user, loading, error] = useAuthState(auth);
    const [userInfo, setUserInfo] = useState([]);
    const navigate = useNavigate();
    const [password, setPassword] = useState("");

    const { id } = useParams();

    const currentUser = auth.currentUser;

    //function for automatically retrieving user
    useEffect(() => {
        const q = query(collection(db, 'users'), where("uid", "==", id));
        onSnapshot(q, (querySnapshot) => {
            setUserInfo(querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
        })
    }, [])

    //function for updating the current user
    const updateUserProfile = async (name, userID) => {
        const userDocRef = doc(db, 'users', userID);
        try {
            await updateDoc(userDocRef, {
                name: name,
            })
            updateProfile(auth.currentUser, {
                displayName: name,
            })
            alert("User updated successfully!");
        } catch (err) {
            alert(err)
        }
    };

    //function for deleting the current user
    const deleteCurrentUser = async (userID) => {
        if (password === null || password.trim() === "") {
            alert("Please enter a password to delete your account");
        } else {
            const response = window.confirm("Are you sure you want to delete your account?");
            if (response) {
                const credential = EmailAuthProvider.credential(
                    auth.currentUser.email,
                    password
                )
                const result = await reauthenticateWithCredential(
                    auth.currentUser,
                    credential
                )
                try {
                    await deleteUser(result.user);
                } catch (err) {
                    alert(err)
                }
                const userDocRef = doc(db, 'users', userID);
                try {
                    await deleteDoc(userDocRef)
                } catch (err) {
                    alert(err)
                }
                console.log("Account has been deleted");
                localStorage.removeItem("user");
                navigate("/");
            }
        }
    }

    return (
        <div>
            <Menu />
            {userInfo.map((user) => (
                <div className="reset">
                    <div className="reset__container">
                        <p>Name: {user.data.name}</p>
                        <p>Email: {user.data.email}</p>
                        <input
                            type="text"
                            className="reset__textBox"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter new name"
                        />
                        <button
                            className="reset__btn"
                            onClick={() => updateUserProfile(name, user.id)}
                        >
                            Update name
                        </button>
                        <button
                            className="reset__btn"
                            onClick={() => sendPasswordReset(user.data.email)}
                        >
                            Send password reset email
                        </button>
                        <input
                            type="password"
                            className="login__textBox"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                        <button
                            className="reset__btn"
                            onClick={() => deleteCurrentUser(user.id)}
                        >
                            Delete account
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
