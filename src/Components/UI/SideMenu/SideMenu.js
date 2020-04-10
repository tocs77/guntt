import React, { useContext } from "react";

import classes from "./SideMenu.module.css";

import TaskPanel from "./TaskPanel/TaskPanel";

import { TasksContext } from "../../../contexts/taskContext";
import * as actionTypes from "../../../contexts/actionTypes";

const SideMenu = props => {
  const { tasks, tasksDispatch } = useContext(TasksContext);

  const mouseEnterPanelHandler = (e, id) => {
    console.log("Enter on ", id);
    tasksDispatch({
      type: actionTypes.HIGHLIGHT_TASK,
      id: id,
      value: true
    });
  };

  const mouseLeavePanelHandler = (e, id) => {
    console.log("Leave ", id);
    tasksDispatch({
      type: actionTypes.HIGHLIGHT_TASK,
      id: id,
      value: false
    });
  };

  const tasksElements = tasks.map(task => {
    return (
      <TaskPanel
        task={task}
        key={task.id}
        mouseEnter={e => mouseEnterPanelHandler(e, task.id)}
        mouseLeave={e => mouseLeavePanelHandler(e, task.id)}></TaskPanel>
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
