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

// Assuming you have the supabase client configured

async function updateUsersTable() {
  try {
    const { data, error } = await supabase
      .from("users")
      .alter({ addColumn: [{ name: "ID", type: "text" }] });

    if (error) {
      throw error;
    }

    console.log("Column added successfully:", data);
  } catch (error) {
    console.error("Error adding column:", error.message);
  }
}

// Call the function to update the table
updateUsersTable();
