// This file contains finction to srver api calls

import axios from './axios-instance';

export const getAllTasks = async () => {
  const token = sessionStorage.getItem('authToken');
  let response = await axios.get('/tasks', { headers: { Authorization: token } });
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
  const token = sessionStorage.getItem('authToken');
  let response = await axios.delete('/tasks', {
    headers: { Authorization: token },
    data: { id: taskId },
  });
  return response.data;
};

export const addTask = async (task) => {
  const token = sessionStorage.getItem('authToken');
  let response = await axios.post('/tasks', { ...task }, { headers: { Authorization: token } });
  return response.data;
};

export const updateTask = async (task) => {
  const token = sessionStorage.getItem('authToken');
  let response = await axios.put('/tasks', { ...task }, { headers: { Authorization: token } });
  return response.data;
};

/*
authData format
authData = {
      userName: <name>,
      password: <password>
    }
*/
export const authenticate = async (authData) => {
  let response = await axios.post('/auth', { ...authData });
  return response.data;
};
