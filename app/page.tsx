"use client";
import { getSystemErrorName } from "util";
import AddTask from "./AddTask";
import React, { useState } from "react";

const NameInputButton = () => {
  const [name, setName] = useState("");
  const [namesList, setNamesList] = useState([]);

  const handleInputChage = (event) => {
    setName(event.target.value);
  };

  const handleButtonClick = () => {
    if (name.trim() !== "") {
      setNamesList((prevNames) => [...prevNames, name]);
      setName("");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Type your name"
        value={name}
        onChange={handleInputChage}
      />
      <button onClick={handleButtonClick}>Add Task</button>
      <div>
        <h2>Task List:</h2>
        <ul>
          {namesList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NameInputButton;
