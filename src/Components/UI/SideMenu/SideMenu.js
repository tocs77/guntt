import React, { useContext } from "react";

import classes from "./SideMenu.module.css";

import TaskPanel from "./TaskPanel/TaskPanel";

import { TasksContext } from "../../../contexts/taskContext";

const SideMenu = props => {
  const { tasks } = useContext(TasksContext);

  const tasksElements = tasks.map(task => <TaskPanel Task={task}></TaskPanel>);

  return (
    <div className={classes.sideMenu}>
      <div className={classes.header}>TAKS</div>
      {tasksElements}
    </div>
  );
};

export default SideMenu;
