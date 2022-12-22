import React from "react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { db } from "./utils/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const initialList = [];

export default function Todo() {

    const [list, setList] = useState(initialList);
    const [name, setName] = useState("");
    const [isDoubleClicked, setDoubleClicked] = useState(false);

    function handleChange(event) {
        event.preventDefault();
        setName(event.target.value);

    }

    function handleAdd() {
        const newList = list.concat({ name, id: uuidv4() });
        setList(newList);
        setName("");
        console.log(list);
    }

    function handleClick(event) {
        if (event.detail === 2) {
            console.log("double click");
            setDoubleClicked(current => !current);
            event.currentTarget.classList.toggle('double-clicked');
        }
    }

    function handleRemove(id) {
        console.log(id);
        const newList = list.filter((item) => item.id !== id);
        setList(newList);
    }

    return (
        <div>
            <div>
                <div>
                    <h1>To Do List App</h1>
                    {list.length <= 0 &&
                        <p>Double click to mark an item off, click on "X" to delete an item, and drag items to reorder.</p>
                    }
                    {list.length > 0 &&
                        <p>Nice list!</p>
                    }
                </div>
                <input
                    type="text"
                    value={name}
                    onChange={handleChange}
                />
                <button
                    type="submit"
                    onClick={handleAdd}
                >
                    Add
                </button>
            </div>

            {list.length > 0 &&
                <ol>
                    {list.map((item => (
                        <li key={item.id}
                            onClick={handleClick}
                        >
                            {item.name} <button onClick={() => handleRemove(item.id)}>x</button>
                        </li>
                    )))}
                </ol>
            }
        </div>
    );
};