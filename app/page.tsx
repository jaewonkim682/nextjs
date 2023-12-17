"use client";

import React, { ChangeEvent, MouseEvent, useState, useEffect } from "react";
import { IoTrashBinSharp } from "react-icons/io5";
import { FaRegSquare, FaRegCheckSquare } from "react-icons/fa";

const taskComponent: React.FC = () => {
  const [task, setTask] = useState("");
  const [tasksList, setTasksList] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const storedTasks = localStorage.getItem("tasksList");
      return storedTasks ? JSON.parse(storedTasks) : [];
    }
    return [];
  });
  const [taskDone, setTaskDone] = useState<boolean[]>(() => {
    return Array(tasksList.length).fill(false);
  });
  const [iconClicked, seticonClicked] = useState<boolean[]>(() => {
    return Array(tasksList.length).fill(false);
  });
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
  };

  const handleButtonClick = () => {
    if (task.trim() !== "") {
      setTasksList((prevtasks) => {
        const updateTasks = [...prevtasks, task];
        localStorage.setItem("tasksList", JSON.stringify(updateTasks));
        setTaskDone((prevTaskDones) => [...prevTaskDones, false]);
        return updateTasks;
      });
      setTask("");
    }
  };
  const insertTasks = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleButtonClick();
    }
  };
  const taskDeleteButton = (index: number) => {
    setTasksList((taskLsts) => taskLsts.filter((_, i) => i !== index));
    setTaskDone((taskDone) => taskDone.filter((_, i) => i !== index));
  };

  const haveDoneThis = (index: number) => {
    setTaskDone((prevTaskDones) =>
      prevTaskDones.map((done, i) => (i === index ? !done : done))
    );
    seticonClicked((previcon) =>
      previcon.map((clicked, i) => (i === index ? !clicked : clicked))
    );
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 style={{ fontSize: "64px" }}>TO DO LIST</h1>
      <div className="flex gap-4">
        <input
          className=" bg-slate-300"
          type="text"
          placeholder="Type your task"
          value={task}
          onChange={handleInputChange}
          onKeyDown={insertTasks}
        />
      </div>
      <div className="text-center">
        <div className="flex flex-col gap-4">
          {tasksList.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              {iconClicked[index] ? (
                <FaRegCheckSquare
                  className="hover:cursor-pointer hover:scale-150 transition "
                  onClick={() => haveDoneThis(index)}
                />
              ) : (
                <FaRegSquare
                  className="hover:cursor-pointer hover:scale-150 transition"
                  onClick={() => haveDoneThis(index)}
                />
              )}
              <p
                className={`${
                  taskDone[index] ? "line-through " : ""
                }  flex gap-6 task-item`}
              >
                {item}
              </p>
              <IoTrashBinSharp
                className="hover:cursor-pointer hover:scale-150 transition"
                onClick={() => taskDeleteButton(index)}
              />
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .task-item {
          border-bottom: 3px solid #191970;
          padding-bottom: 3px;
        }
      `}</style>
    </div>
  );
};
export default taskComponent;
