import React from "react";
import * as actionTypes from "./actionTypes";

export const initialTasks = [
  {
    startDate: new Date("March 27, 2020 00:00:00"),
    endDate: new Date("March 30, 2020 00:00:00"),
    task: "Develop SVG",
    id: 1,
    done: false,
    highlight: false,
  },
  {
    startDate: new Date("March 20, 2020 00:00:00"),
    endDate: new Date("April 7, 2020 00:00:00"),
    task: "Buy Milk",
    id: 2,
    done: false,
    highlight: false,
  },
  {
    startDate: new Date("March 15, 2020 00:00:00"),
    endDate: new Date("March 29, 2020 00:00:00"),
    task: "Find key",
    id: 3,
    done: false,
    highlight: false,
  },
  {
    startDate: new Date("March 17, 2020 00:00:00"),
    endDate: new Date("March 23, 2020 00:00:00"),
    task: "Clear room",
    id: 4,
    done: false,
    highlight: false,
  },
  {
    startDate: new Date("March 26, 2020 00:00:00"),
    endDate: new Date("April 8, 2020 00:00:00"),
    task: "Build rocket",
    id: 5,
    done: false,
    highlight: false,
  },

];

export const taskReducer = (tasks = initialTasks, action) => {
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
          task.done = action.value;
        }
      }
      return tasks;
      
    case actionTypes.DELETE_TASK:
      tasks = tasks.filter((task) => task.id !== action.id);
      return tasks;
    default:
      return tasks;
  }
};

export const TasksContext = React.createContext();
