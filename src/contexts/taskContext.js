import React from "react";
import * as actionTypes from "./actionTypes";
import taskPanel from "../Components/UI/SideMenu/TaskPanel/TaskPanel";

export const initialTasks = [
  {
    startDate: new Date("March 27, 2020 00:00:00"),
    endDate: new Date("March 30, 2020 00:00:00"),
    task: "Develop SVG",
    id: 1,
    highlight: false
  },
  {
    startDate: new Date("March 20, 2020 00:00:00"),
    endDate: new Date("April 7, 2020 00:00:00"),
    task: "Buy Milk",
    id: 2,
    highlight: false
  },
  {
    startDate: new Date("March 15, 2020 00:00:00"),
    endDate: new Date("March 29, 2020 00:00:00"),
    task: "Find key",
    id: 3,
    highlight: false
  },
  {
    startDate: new Date("March 17, 2020 00:00:00"),
    endDate: new Date("March 23, 2020 00:00:00"),
    task: "Clear room",
    id: 4,
    highlight: false
  },
  {
    startDate: new Date("March 26, 2020 00:00:00"),
    endDate: new Date("April 8, 2020 00:00:00"),
    task: "Build rocket",
    id: 5,
    highlight: false
  }
];

export const taskReducer = (tasks = initialTasks, action) => {
  switch (action.type) {
    case actionTypes.ADD_TASK:
      tasks = [...tasks];
      action.task.id = Date(); //TODO id will be from server
      action.task.highlight = false;
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
    default:
      return tasks;
  }
};

export const TasksContext = React.createContext();
