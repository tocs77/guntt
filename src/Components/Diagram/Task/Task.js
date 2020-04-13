import React from "react";

import cx from "classnames";

import classes from "./Task.module.css";

const Task = (props) => {
  const taskClasses = [
    classes.color_1,
    classes.color_2,
    classes.color_3,
    classes.color_4,
    classes.color_5,
    classes.color_6,
    classes.color_7,
    classes.color_8,
  ];

  const mouseEnterHandler = () => {
    console.log("Mouse over!");
  };
  let taskClass = taskClasses[props.index];
  //console.log(taskClass, props.index);
  if (!taskClass) {
    taskClass = classes.color_default;
  }

  if (props.task.highlight) {
    taskClass = classes.color_highlighted;
  }

  const taskTextClasses = [classes.taskText];

  if (props.task.done) {
    taskClass = classes.color_done;
    taskTextClasses.push(classes.textDone);
  }
  // taskClasses.push("color_" + toString(props.index));
  return (
    <React.Fragment>
      <text
        x='2%'
        y={props.y + props.height / 2 + props.height / 6}
        className={cx(taskTextClasses)}>
        {props.task.task}
      </text>
      <rect
        x={props.x}
        y={props.y + props.height / 2 - props.height / 6}
        className={taskClass}
        width={props.width}
        height={props.height / 3}
        ry='5%'
        onMouseOver={mouseEnterHandler}
      />
      <line
        x1='0%'
        y1={props.y + props.height}
        x2='100%'
        y2={props.y + props.height}
        className={classes.bottom_line}
      />
    </React.Fragment>
  );
};

export default Task;
