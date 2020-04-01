import React from "react";

import classes from "./Task.module.css";

const Task = props => {
  return (
    <React.Fragment>
      <text
        x="2%"
        y={props.y + props.height / 2 + props.height / 6}
        className={classes.taskText}
      >
        {props.task}
      </text>
      <rect
        x={props.x}
        y={props.y + props.height / 2 - props.height / 6}
        className={classes.task}
        width={props.width}
        height={props.height / 3}
      />
      <line
        x1="0%"
        y1={props.y + props.height}
        x2="100%"
        y2={props.y + props.height}
        className={classes.bottom_line}
      />
    </React.Fragment>
  );
};

export default Task;
