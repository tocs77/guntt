import React from "react";

import Button from "../../Button/Button";

import classes from "./TaskPanel.module.css";

const taskPanel = props => {
  return (
    <div className={classes.taskPanel}>
      <div className={classes.label}>{props.Task.task}</div>

      <Button clickHandler={null} size='small'>
        Done
      </Button>
      <Button clickHandler={null} size='small'>
        Delete
      </Button>
    </div>
  );
};

export default taskPanel;
