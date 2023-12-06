"use client";
import React, { useState } from 'react';

const NameInputButton = () => {
  const [name, setName] = useState('');
  const [nameList, setNamesList] = useState([]);
}


const AddTask = () => {
  }
  return (
    <div className="p-5 my-5 bg-sky-400 text-white text-xl hover:bg-sky-500">
      <button className="btn btn-primary" onClick={onClick}>
        Add Task
      </button>
    </div>
  );
};

export default AddTask;
