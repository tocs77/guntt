import React from 'react';

import * as actionTypes from './actionTypes';

export const taskReducer = (tasks = [], action) => {
  switch (action.type) {
    case actionTypes.ADD_TASK:
      tasks = [...tasks];
      action.task.id = Date(); //TODO id will be from server
      action.task.highlight = false;
      action.task.done = false;
      tasks.push(action.task);
      return tasks;
    case actionTypes.GET_ALL_TASKS:
      return tasks;

    case actionTypes.HIGHLIGHT_TASK:
      tasks = [...tasks];
      for (let task of tasks) {
        if (task.id === action.id) {
          task.highlight = action.value;
        }
      }
      return tasks;

    case actionTypes.DONE_TASK:
      tasks = [...tasks];
      for (let task of tasks) {
        if (task.id === action.id) {
          task.done = action.value; //? Need value to set done true/false
        }
      }
      return tasks;

    case actionTypes.DELETE_TASK:
      tasks = tasks.filter((task) => task.id !== action.id);
      return tasks;

    case actionTypes.EDIT_TASK:
      tasks = [...tasks];
      for (let task of tasks) {
        if (task.id === action.id) {
          task.task = action.task;
          task.startDate = action.startDate;
          task.endDate = action.endDate;
        }
      }
      return tasks;

    case actionTypes.INIT_TASKS:
      tasks = [...action.tasks];
      return tasks;

    default:
      return tasks;
  }
};

export const TasksContext = React.createContext();
