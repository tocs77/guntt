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
  return response.data.OperationStatus;
};
