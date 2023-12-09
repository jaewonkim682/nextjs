"use client";

import React, { ChangeEvent, MouseEvent, useState } from "react";

const NameInputButton = () => {
  const [name, setName] = useState("");
  const [namesList, setNamesList] = useState<string[]>([]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleButtonClick = () => {
    if (name.trim() !== "") {
      setName("");
      setNamesList((prevNames) => [...prevNames, name]);
    }
  };

  const deleteButtonClick = () => {
    setNamesList(namesList.slice(0, namesList.length - 1));
    // const list = namesList;
    // console.log(list);
    // setNamesList(list.slice(0, list.length - 1));
  };

  const taskDeleteButton = (index: number) => {
    setNamesList((taskLsts) => taskLsts.filter((_, i) => i !== index));
  };

  return (
    <div>
      <button
        className="absolute top-0 left-96 underline bg-sky-400"
        onClick={handleButtonClick}
      >
        Add Task
      </button>
      <button
        className="absolute top-0 left-0 underline bg-red-400"
        onClick={deleteButtonClick}
      >
        Delete Task
      </button>
      <input
        className="absolute top-0 right-96 bg-slate-300"
        type="text"
        placeholder="Type your name"
        value={name}
        onChange={handleInputChange}
      />
      <div>
        <h2 className="absolute top-10 left-96 bg-emerald-400"> Task List: </h2>
        <ul className="absolute top-16 left-96 text-lg">
          {namesList.map((item, index) => (
            <li key={index}>
              {item}
              <button
                className="underline bg-red-400"
                onClick={() => taskDeleteButton(index)}
              >
                Delete Task
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NameInputButton;
