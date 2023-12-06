// components/TaskModal.tsx
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import styles from "./taskModal.module.css";
import useTasks from "@/app/hooks/useTasks";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose }) => {
  const { createTask, createError } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Fetch user's geolocation
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error.message);
        }
      );
    }
  }, [isOpen]);

  const handleSave = async () => {
    try {
      await createTask({
        title,
        description,
        latitude: latitude!,
        longitude: longitude!,
      });
      setTitle("");
      setDescription("");
      setLatitude(null);
      setLongitude(null);
      onClose();
    } catch (error: any) {
      console.error("Error creating task:", error.message);
      alert("Error creating task. Please try again.");
    }
  };

  useEffect(() => {
    if (createError) {
      console.log(createError.networkError.result);
    }
  }, [createError]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
      contentLabel="Add Task Modal"
    >
      <h2 className={styles.title}>Add Task</h2>
      <label className={styles.formLabel}>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />
      </label>
      <label className={styles.formLabel}>
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.textarea}
        />
      </label>
      <p>
        Latitude: {latitude !== null ? latitude.toFixed(6) : "Loading..."}
        <br />
        Longitude: {longitude !== null ? longitude.toFixed(6) : "Loading..."}
      </p>
      <button className={styles.button} onClick={handleSave}>
        Save Task
      </button>
    </Modal>
  );
};

export default TaskModal;
