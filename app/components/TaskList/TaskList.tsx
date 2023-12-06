"use client";

import React, { use, useEffect, useState } from "react";
import styles from "./taskList.module.css";
import useTasks from "../../hooks/useTasks";
import TaskModal from "../AddTask/TaskModal";
import { calculateDistance } from "../../helper/calculateDistance";

const TaskList: React.FC = () => {
  const { data, deleteTask, loading, error, deleteData, refetch } = useTasks();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error: any) {
      console.error("Error deleting task:", error.message);
      alert("Error deleting task. Please try again.");
    }
  };

  useEffect(() => {
    if (data) {
      setTasks(data.getTasks);
    }
  }, [data]);

  useEffect(() => {
    if (deleteData) {
      refetch();
    }
  }, [deleteData]);

  const checkNearbyTasks = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLatitude = position.coords.latitude;
        const userLongitude = position.coords.longitude;

        tasks.forEach((task) => {
          const distance = calculateDistance(
            userLatitude,
            userLongitude,
            task.latitude,
            task.longitude
          );

          // Assuming a threshold of 500 meters
          if (distance <= 500) {
            alert(`You are near the task: ${task.title}`);
          }
        });
      },
      (error) => {
        console.error("Error getting geolocation:", error.message);
      }
    );
  };

  useEffect(() => {
    // Check nearby tasks every 5 seconds (adjust as needed)
    const intervalId = setInterval(checkNearbyTasks, 5000);

    return () => clearInterval(intervalId);
  }, [tasks]);

  return (
    <div className={styles.taskList}>
      <div className={styles.header}>
        <h2 className={styles.title}>Task List</h2>
        <button className={styles.addButton} onClick={() => setOpenModal(true)}>
          Add Task
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Something went wrong, try to refresh again</p>
      ) : tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <ul className={styles.listContainer}>
          {tasks.map((task) => (
            <li key={task.id} className={styles.listItem}>
              <span className={styles.itemTitle}>{task.title}</span>
              <p className={styles.itemDescription}>{task.description}</p>
              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteTask(task.id as string)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <TaskModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
};

export default TaskList;
