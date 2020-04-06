import React from "react";
import * as actionTypes from "./actionTypes";

export const initialTasks = [
  {
    startDate: new Date("March 27, 2020 00:00:00"),
    endDate: new Date("March 30, 2020 00:00:00"),
    task: "Develop SVG"
  },
  {
    startDate: new Date("March 20, 2020 00:00:00"),
    endDate: new Date("April 7, 2020 00:00:00"),
    task: "Buy Milk"
  },
  {
    startDate: new Date("March 15, 2020 00:00:00"),
    endDate: new Date("March 29, 2020 00:00:00"),
    task: "Find key"
  },
  {
    startDate: new Date("March 17, 2020 00:00:00"),
    endDate: new Date("March 23, 2020 00:00:00"),
    task: "Clear room"
  },
  {
    startDate: new Date("March 26, 2020 00:00:00"),
    endDate: new Date("April 8, 2020 00:00:00"),
    task: "Build rocket"
  }
];

export const taskReducer = (tasks = initialTasks, action) => {
  switch (action.type) {
    case actionTypes.ADD_TASK:
      tasks = [...tasks];
      tasks.push(action.task);
      return tasks;
    case actionTypes.GET_ALL_TASKS:
      return tasks;
    default:
      return tasks;
  }
};

export const TasksContext = React.createContext();
