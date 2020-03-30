import React from "react";

import classes from "./Task.module.css";

const Task = props => {
  return (
    <React.Fragment>
      <text x="2%" y={props.y} className={classes.taskText }>
        {props.task}
      </text>
      <rect
        x={props.x}
        y={props.y}
        className={classes.task}
        width={props.width}
        height="10"
      />
    </React.Fragment>
  );
};

export default Task;
