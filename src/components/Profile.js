import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, db, logout } from "./utils/firebase";
import { collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, Timestamp, query, orderBy, onSnapshot, where } from "firebase/firestore";
import Menu from "./Menu";

export default function Profile() {

    const [name, setName] = useState("");
    const [user, loading, error] = useAuthState(auth);
    const [userInfo, setUserInfo] = useState([]);
    const navigate = useNavigate();

    const { id } = useParams();

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

    //function for updating a user
    const updateUserProfile = async (name, id) => {
        const userDocRef = doc(db, 'users', id);
        try {
            await updateDoc(userDocRef, {
                name: name,
            })
            alert("User updated successfully!")
        } catch (err) {
            alert(err)
        }
    };

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
                            placeholder={user.data.name}
                        />
                        <button
                            className="reset__btn"
                            onClick={() => updateUserProfile(name, user.id)}
                        >
                            Update name
                        </button>
                        <div className="users">


                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
