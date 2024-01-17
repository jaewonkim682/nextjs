"use client";

import React, { ChangeEvent, MouseEvent, useState, useEffect } from "react";
import { IoTrashBinSharp } from "react-icons/io5";
import { FaRegSquare, FaRegCheckSquare } from "react-icons/fa";
import styles from "./taskComponent.module.css";
import { createClient } from "@supabase/supabase-js";
import { PostgrestError, PostgrestSingleResponse } from "@supabase/supabase-js";

const supabaseUrl = "https://kroefhdomebekbuyzdlp.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtyb2VmaGRvbWViZWtidXl6ZGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI5OTQ4MDEsImV4cCI6MjAxODU3MDgwMX0.DsWkQAyMXbQ7qn0XDjZk3LUeRiujOfxU5FUUGH7t55s";
const supabase = createClient(supabaseUrl, supabaseKey);

interface TaskData {
  title: string;
  done: boolean;
}

const TaskComponent: React.FC = () => {
  const [task, setTask] = useState("");
  const [tasksList, setTasksList] = useState<string[]>(() => {
    return [];
  });
  const [taskDone, setTaskDone] = useState<boolean[]>(() => {
    return Array(tasksList.length).fill(false);
  });
  const [iconClicked, setIconClicked] = useState<boolean[]>(() => {
    return Array(tasksList.length).fill(false);
  });
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
  };
  const fetehTasks = async () => {
    try {
      const { data, error }: PostgrestSingleResponse<any[]> = await supabase
        .from("tasks")
        .select("*");
      if (error) {
        throw error;
      }

      setTasksList(data.map((task) => task.title));
      setTaskDone(data.map((task) => task.done));
      setIconClicked(data.map(() => false));
    } catch (error) {
      console.error("Error fetching tasks:", (error as PostgrestError).message);
    }
  };

  useEffect(() => {
    fetehTasks();
  }, []);

  const handleButtonClick = async () => {
    if (task.length >= 10) {
      window.alert(
        "You are about to add more then 10 tasks. Stop planning and to these first ^^b"
      );
      return;
    }

    if (task.trim() !== "") {
      try {
        const { data, error }: PostgrestSingleResponse<any[]> = await supabase
          .from("tasks")
          .upsert([
            {
              title: task,
            },
          ])
          .select();
        if (error) {
          throw error;
        }
        if (data) {
          setTasksList((prevTasks) => [...prevTasks, data[0].title]);
          setTaskDone((prevTaskDone) => [...prevTaskDone, false]);
          setIconClicked((prevIconClicked) => [...prevIconClicked, false]);
          setTask("");
        } else {
          console.error("No data returned after upsert operation");
        }
      } catch (error) {
        console.error("Error adding task:", (error as Error).message);
      }
    }
  };

  const insertTasks = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleButtonClick();
      setIconClicked((previous) => [...previous, false]);
    }
  };
  const taskDeleteButton = async (index: number) => {
    try {
      await supabase.from("tasks").delete().eq("title", tasksList[index]);
      setTasksList((taskLsts) => taskLsts.filter((_, i) => i !== index));
      setTaskDone((taskDone) => taskDone.filter((_, i) => i !== index));
      setIconClicked((prevIconCLicked) =>
        prevIconCLicked.filter((_, i) => i !== index)
      );
    } catch (error) {
      console.error("Error deleting task: ", (error as PostgrestError).message);
    }
  };

  const haveDoneThis = async (index: number) => {
    try {
      await supabase
        .from("tasks")
        .update({ done: !taskDone[index] })
        .eq("title", tasksList[index]);
      setTaskDone((prevTaskDones) =>
        prevTaskDones.map((done, i) => (i === index ? !done : done))
      );
      setIconClicked((previcon) =>
        previcon.map((clicked, i) => (i === index ? !clicked : clicked))
      );
    } catch (error) {
      console.error("Error updating task:", (error as PostgrestError).message);
    }
  };

  const truncateText = (text:string, maxLength:number) => {
    if (text.length > maxLength) {
      return `${text.slice(0, maxLength)}\n${text.slice(maxLength)}`;
    }
    return text;
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h3>simple but essential</h3>
      <h1 style={{ fontSize: "64px" }}>TO DO LIST</h1>
      <h3>click enter</h3>
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
            <div key={index} className={`${styles["task-item-container"]}`}>
              <div className="flex items-center gap-4">
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
                  }  flex gap-8 ${styles["task-item"]}`}
                >
                  {item.length > 15 ? (
                    <>
                      {item.slice(0, 15)}
                      <br />
                      {item.slice(15, 30)}
                      <br />
                      {item.slice(30)}
                    </>
                  ) : (
                    item
                  )}
                </p>
              </div>
              <IoTrashBinSharp
                className="hover:cursor-pointer hover:scale-150 transition ml-4"
                onClick={() => taskDeleteButton(index)}
              />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        ${styles["task-item"]}
      `}</style>
    </div>
  );
};
export default TaskComponent;
