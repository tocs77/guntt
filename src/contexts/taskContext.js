import React from 'react';

import axios from '../axios-instance';
import * as actionTypes from './actionTypes';

export const initialTasks = [
  {
    startDate: new Date('2020-03-27T00:00:00Z'),
    endDate: new Date('2020-03-30T00:00:00Z'),
    task: 'Develop SVG',
    id: 1,
    done: false,
    highlight: false,
  },
  {
    startDate: new Date('2020-03-20T00:00:00Z'),
    endDate: new Date('2020-04-07T00:00:00Z'),
    task: 'Buy Milk',
    id: 2,
    done: false,
    highlight: false,
  },
  {
    startDate: new Date('2020-03-15T00:00:00Z'),
    endDate: new Date('2020-03-29T00:00:00Z'),
    task: 'Find key',
    id: 3,
    done: false,
    highlight: false,
  },
  {
    startDate: new Date('2020-03-17T00:00:00Z'),
    endDate: new Date('2020-03-23T00:00:00Z'),
    task: 'Clear room',
    id: 4,
    done: false,
    highlight: false,
  },
  {
    startDate: new Date('2020-03-26T00:00:00Z'),
    endDate: new Date('2020-04-08T00:00:00Z'),
    task: 'Build rocket',
    id: 5,
    done: false,
    highlight: false,
  },
  // {
  //   startDate: new Date("April 17, 2020 00:00:00"),
  //   endDate: new Date("May 8, 2020 00:00:00"),
  //   task: "Fix SVG problems",
  //   id: 6,
  //   done: false,
  //   highlight: false,
  // },
];

export const initTasks = () => {
  axios
    .get('/tasks')
    .then((response) => {
      const newTasks = response.data.map((task) => {
        const t = {};
        t.taks = task.task;
        t.startDate = new Date(task.startDate);
        t.endDate = new Date(task.endDate);
        t.done = task.done;
        t.id = task.id;
        t.highlight = false;
        return t;
      });
      console.log("new tasks", newTasks)
      return newTasks;
    })
    .catch((error) => {
      console.log(error);
    });
    return []
};

export const taskReducer = (tasks = () => initTasks(), action) => {
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
      

    default:
      return tasks;
  }
};

export const TasksContext = React.createContext();
