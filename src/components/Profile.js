import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, db, logout } from "./utils/firebase";
import { collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, Timestamp, query, orderBy, onSnapshot, where } from "firebase/firestore";
import Menu from "./Menu";
import { getAuth, updatePassword, updateProfile } from "firebase/auth";

export default function Profile() {

    const [name, setName] = useState("");
    const [user, loading, error] = useAuthState(auth);
    const [userInfo, setUserInfo] = useState([]);
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = "";
    const [newPassword, setNewPassword] = "";

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
        console.log(user.displayName);
    }, [])

    //function for updating a user
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

    //function for updating password (not working)
    const updateUserPassword = async (currentUser, newPassword) => {
        updatePassword(currentUser, newPassword).then(() => {
            alert("Password updated successfully!")
        }).catch((err) => {
            alert(err)
        });
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
                        <input
                            type="text"
                            className="reset__textBox"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                        />
                        <button
                            className="reset__btn"
                            onClick={() => updateUserPassword(currentUser, newPassword)}
                        >
                            Update password
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
