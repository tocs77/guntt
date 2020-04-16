import React, { useContext } from 'react';

import cx from 'classnames';

import classes from './Task.module.css';
import { AppContext } from '../../../contexts/appContext';
import * as actiontypes from '../../../contexts/actionTypes';

const Task = (props) => {
  const { appDispatch } = useContext(AppContext);

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

  const mouseEnterHandler = (event, id) => {
    const x = event.clientX;
    const y = event.clientY;

    appDispatch({
      type: actiontypes.SHOW_TASK_POPUP_MENU,
      x: x,
      y: y,
      taskID: id,
      locked: false,
    });
  };

  const mouseLeaveHandler = () => {
    setTimeout(
      () =>
        appDispatch({
          type: actiontypes.HIDE_TASK_POPUP_MENU,
          forced: false,
        }),
      500
    );
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
        className={cx(taskTextClasses)}
      >
        {props.task.task}
      </text>
      <rect
        x={props.x}
        y={props.y + props.height / 2 - props.height / 6}
        className={cx(classes.taskRect, taskClass)}
        width={props.width}
        height={props.height / 3}
        ry='5%'
        onMouseEnter={(e) => mouseEnterHandler(e, props.task.id)}
        onMouseLeave={() => mouseLeaveHandler()}
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
