// This file contains finction to srver api calls

import axios from './axios-instance';

export const getAllTasks = async () => {
  let response = await axios.get('/tasks');
  const newTasks = response.data.map((task) => {
    const t = {};
    t.task = task.task;
    t.startDate = new Date(task.startDate);
    t.endDate = new Date(task.endDate);
    t.done = task.done;
    t.id = task.id;
    t.highlight = false;
    return t;
  });

  return newTasks;
};

export const deleteTask = async (taskId) => {
  let response = await axios.delete('/tasks', { data: { id: taskId } });
  return response.data;
};

export const addTask = async (task) => {
  let response = await axios.post('/tasks', { ...task });
  return response.data;
};

export const updateTask = async (task) => {
  let response = await axios.put('/tasks', { ...task });
  return response.data;
};




/*
authData format
authData = {
      userName: <name>,
      password: <password>
    }
*/
export const authenticate= async (authData) => {
  let response = await axios.post('/auth', { ...authData });
  return response.data;
};