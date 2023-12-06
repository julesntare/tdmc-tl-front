import { gql } from "@apollo/client";

export const CREATE_TASK = gql`
  mutation CreateTask($task: TaskInput) {
    createTask(task: $task) {
      id
      title
      description
      latitude
      longitude
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: TaskInput!) {
    updateTask(id: $id, task: $input) {
      id
      title
      description
      latitude
      longitude
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;
