import React from "react";

import Button from "../../Button/Button";

import classes from "./TaskPanel.module.css";

const taskPanel = (props) => {
  return (
    <div
      onMouseEnter={props.mouseEnter}
      onMouseLeave={props.mouseLeave}
      className={classes.taskPanel}>
      <div className={classes.label}>{props.task.task}</div>

      <Button clickHandler={props.doneTask} size='small'>
        Done
      </Button>
      <Button clickHandler={props.deleteTask} size='small'>
        Delete
      </Button>
    </div>
  );
};

export default taskPanel;
