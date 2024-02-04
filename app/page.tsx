"use client";

import React, { ChangeEvent, MouseEvent, useState, useEffect } from "react";
import Modal from "react-modal";
import { IoTrashBinSharp } from "react-icons/io5";
import { FaRegSquare, FaRegCheckSquare } from "react-icons/fa";
import styles from "./taskComponent.module.css";
import { createClient } from "@supabase/supabase-js";
import { PostgrestError, PostgrestSingleResponse } from "@supabase/supabase-js";

const supabaseUrl = "https://kroefhdomebekbuyzdlp.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtyb2VmaGRvbWViZWtidXl6ZGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI5OTQ4MDEsImV4cCI6MjAxODU3MDgwMX0.DsWkQAyMXbQ7qn0XDjZk3LUeRiujOfxU5FUUGH7t55s";
const supabase = createClient(supabaseUrl, supabaseKey);

const TaskComponent: React.FC = () => {
  interface user {
    ID: string;
    password: string;
  }
  const [user, setUser] = useState<any | null>(null);
  const [ID, setID] = useState("");
  const [password, setPassword] = useState("");
  const [modelIsOpen, setModelIsOpen] = useState(false);
  const [registerID, setRegisterID] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  useEffect(() => {
    const session = supabase.auth as unknown as { user: user };
    setUser(session?.user ?? null);
  }, []);

  const openModel = () => {
    setModelIsOpen(true);
  };

  const closeModel = () => {
    setModelIsOpen(false);
  };

  const handleRegister = async () => {
    try {
      // Check if ID and password are not empty
      if (!registerID || !registerPassword) {
        window.alert("ID and password are required.");
        return;
      }
      // Check if the user with the provided ID already exists
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("ID")
        .eq("ID", registerID);

      if (fetchError) {
        throw fetchError;
      }

      if (existingUser.length > 0) {
        window.alert("This ID already exists");
        return;
      }

      // Register the user
      const { data: newUser, error: registerError } = await supabase
        .from("users")
        .upsert([
          {
            ID: registerID,
            password: registerPassword,
          },
        ]);

      if (registerError) {
        throw registerError;
      }

      window.alert("User registered successfully:" + JSON.stringify(newUser));
      setUser(newUser);
      closeModel();
    } catch (error: any) {
      console.error("Error registering user:", error);
      window.alert("Error registering user:" + JSON.stringify(error.message));
    }

    setPassword("");
    setRegisterID("");
    setRegisterPassword("");
  };

  const handleLogin = async () => {
    try {
      if (!ID || !password) {
        window.alert("ID and password are required.");
        return;
      }
      const { data: user, error } = await supabase
        .from("users")
        .select("ID, password")
        .eq("ID", ID)
        .eq("password", password);

      if (error) {
        throw error;
      }

      if (user.length == 0) {
        window.alert("Invalid ID or password");
        return;
      }

      window.alert("Logged in successfully" + JSON.stringify(user));
      setUser(user);
      closeModel();
    } catch (error: any) {
      window.alert("Error logging in:" + JSON.stringify(error.message));
    }

    setPassword("");
    setRegisterID("");
    setRegisterPassword("");
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }
      setUser(null);
      setID("");
    } catch (error: any) {
      window.alert("Error Logging out:" + JSON.stringify(error.message));
    }
    setID("");
    setPassword("");
    setRegisterID("");
    setRegisterPassword("");
  };

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
        .select("*")
        .eq("user_ID", ID); // Fetch tasks only for the logged-in user

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
  }, [ID]);

  const handleButtonClick = async () => {
    if (task.trim() !== "") {
      if (ID.length != 0 && tasksList.length < 10) {
        try {
          const { data, error }: PostgrestSingleResponse<any[]> = await supabase
            .from("tasks")
            .upsert([
              {
                user_ID: ID,
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
      if (ID.length == 0) {
        window.alert("log in to add tasks");
        setTask("");
        setTasksList([]);
      }
      if (tasksList.length >= 10) {
        window.alert(
          "You are about to add more than 10 tasks. Stop planning and do these first ^^b"
        );
      }
      //Need to move the below code to anther const
      // try {
      //   await supabase.from("tasks").delete().eq("user_ID", "");
      //   setTasksList([]);
      // } catch (error) {
      //   console.error(
      //     "Error deleting task: ",
      //     (error as PostgrestError).message
      //   );
      // }
    }
  };

  const insertTasks = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleButtonClick();
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
      const taskId = tasksList[index]; // Assuming your taskList is an array of task IDs
      await supabase
        .from("tasks")
        .update({ done: !taskDone[index] })
        .eq("id", taskId); // Use the task ID for the update

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
  return (
    <div>
      {user ? (
        <div>
          <p>Welcome User!</p>
          <p>Have a nice day if you can!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={openModel}>Login/Register</button>
        </div>
      )}
      <Modal
        isOpen={modelIsOpen}
        onRequestClose={closeModel}
        contentLabel="Login/Register Model"
      >
        <div>
          <button onClick={closeModel}>Close</button>
          <div>
            <label>
              ID:
              <input
                type="text"
                value={ID}
                onChange={(e) => setID(e.target.value)}
              />
            </label>
            <br />
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button onClick={handleLogin}>Login</button>
          </div>
          <br />
          <div>
            <label>
              ID:
              <input
                type="text"
                value={registerID}
                onChange={(e) => setRegisterID(e.target.value)}
              />
            </label>
            <br />
            <label>
              Password:
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
            </label>
            <button onClick={handleRegister}>Register</button>
          </div>
        </div>
      </Modal>
      <div className="flex flex-col items-center justify-center;">
        <h3>simple but essential</h3>
        <h1 style={{ fontSize: "64px" }}>TO DO LIST</h1>
        <h3>Press Enter</h3>
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
    </div>
  );
};

export default TaskComponent;
