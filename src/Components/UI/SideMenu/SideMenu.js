import React, { useContext } from "react";

import classes from "./SideMenu.module.css";

import TaskPanel from "./TaskPanel/TaskPanel";

import { TasksContext } from "../../../contexts/taskContext";
import * as actionTypes from "../../../contexts/actionTypes";

const SideMenu = (props) => {
  const { tasks, tasksDispatch } = useContext(TasksContext);

  const mouseEnterPanelHandler = (id) => {
    tasksDispatch({
      type: actionTypes.HIGHLIGHT_TASK,
      id: id,
      value: true,
    });
  };

  const mouseLeavePanelHandler = (id) => {
    tasksDispatch({
      type: actionTypes.HIGHLIGHT_TASK,
      id: id,
      value: false,
    });
  };

  const deleteTaskHandler = (id) => {
    tasksDispatch({
      type: actionTypes.DELETE_TASK,
      id: id,
    });
  };

  const doneTaskHandler = (id) => {
    tasksDispatch({
      type: actionTypes.DONE_TASK,
      id: id,
      value: true,
    });
  };

  const tasksElements = tasks.map((task) => {
    return (
      <TaskPanel
        task={task}
        key={task.id}
        mouseEnter={() => mouseEnterPanelHandler(task.id)}
        mouseLeave={() => mouseLeavePanelHandler(task.id)}
        deleteTask={() => deleteTaskHandler(task.id)}
        doneTask={() => doneTaskHandler(task.id)}></TaskPanel>
    );
  });

  return (
    <div className={classes.sideMenu}>
      <div className={classes.header}>TASKS</div>
      {tasksElements}
    </div>
  );
};

export default SideMenu;
