import { useMutation, useQuery } from "@apollo/client";
import { CREATE_TASK, UPDATE_TASK, DELETE_TASK } from "../graphql/mutations";
import * as Yup from "yup";
import { GET_TASKS } from "../graphql/queries";

const taskSchema = Yup.object({
  title: Yup.string().required("Title is required"),
});

interface UseTasksHook {
  createTask: (task: ITask) => Promise<void>;
  updateTask: (taskId: string, task: ITask) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  loading: boolean;
  error: any;
  data: ITask[];
  createData: ITask[];
  createLoading: boolean;
  createError: any;
  updateData: ITask[];
  updateLoading: boolean;
  updateError: any;
  deleteData: ITask[];
  deleteLoading: boolean;
  deleteError: any;
  refetch: any;
}

const useTasks = (): UseTasksHook => {
  const { loading, error, data, refetch } = useQuery(GET_TASKS);

  const [
    createTaskMutation,
    { data: createData, loading: createLoading, error: createError },
  ] = useMutation(CREATE_TASK, {
    update(cache, { data: { createTask } }) {
      const { tasks } = (cache.readQuery({ query: GET_TASKS }) || {
        tasks: [],
      }) as { tasks: ITask[] };
      cache.writeQuery({
        query: GET_TASKS,
        data: { tasks: [...tasks, createTask] },
      });
    },
  });

  const [
    updateTaskMutation,
    { data: updateData, loading: updateLoading, error: updateError },
  ] = useMutation(UPDATE_TASK);

  const [
    deleteTaskMutation,
    { data: deleteData, loading: deleteLoading, error: deleteError },
  ] = useMutation(DELETE_TASK);

  const createTask = async (task: ITask) => {
    try {
      await taskSchema.validate(task, { abortEarly: false });
      await createTaskMutation({
        variables: {
          task,
        },
      });
    } catch (validationError: any) {
      console.error("Validation error:", validationError.errors);
      throw new Error("Task validation failed. Please check your input.");
    }
  };

  const updateTask = async (taskId: string, updatedTask: ITask) => {
    try {
      await taskSchema.validate(updatedTask, { abortEarly: false });
      await updateTaskMutation({
        variables: {
          id: taskId,
          input: updatedTask,
        },
      });
    } catch (validationError: any) {
      console.error("Validation error:", validationError.errors);
      throw new Error("Task validation failed. Please check your input.");
    }
  };

  const deleteTask = async (taskId: string) => {
    await deleteTaskMutation({
      variables: {
        id: taskId,
      },
    });
  };

  return {
    data,
    createTask,
    updateTask,
    deleteTask,
    loading,
    error,
    createData,
    createLoading,
    createError,
    updateData,
    updateLoading,
    updateError,
    deleteData,
    deleteLoading,
    deleteError,
    refetch,
  };
};

export default useTasks;
