import React, { useContext } from "react";

import Text from "./Text/Text";
import Task from "./Task/Task";

import classes from "./Diagram.module.css";

import { TasksContext } from "../../contexts/taskContext";

const millisecondInDay = 1000 * 3600 * 24;

const TASK_LABEL_WIDTH = 20; // 20% task labels width
const TASK_HEIGHT = 30; //? Task height in pixels  Maybe in procents?
const HEADER_HEIGHT = TASK_HEIGHT;

const Diagram = () => {
  const { tasks } = useContext(TasksContext);

  if (tasks.length === 0) {
    return <div className={classes.message}>No tasks yet</div>;
  }

  let firstDate = tasks[0].startDate;
  let lastDate = tasks[0].endDate;
  for (let task of tasks) {
    firstDate = task.startDate < firstDate ? task.startDate : firstDate;
    lastDate = task.endDate > lastDate ? task.endDate : lastDate;
  }

  let daysAmount = (lastDate - firstDate) / millisecondInDay + 1;

  const xStep = (100 - TASK_LABEL_WIDTH) / daysAmount;

  const verticalLines = [];
  const dates = [];

  let currentDate = new Date(firstDate);

  for (let d = 0; d < daysAmount; d++) {
    let xCoord = (TASK_LABEL_WIDTH + d * xStep).toString() + "%";
    let textCoord = (TASK_LABEL_WIDTH + d * xStep + xStep / 3).toString() + "%";
    verticalLines.push(
      <line
        key={d}
        x1={xCoord}
        y1='0'
        x2={xCoord}
        y2='100%'
        className={classes.vline}
      />
    );
    dates.push(
      <Text key={d} x={textCoord} y='10%' text={currentDate.getDate()} />
    );

    currentDate.setDate(currentDate.getDate() + 1);
  }

  const tasksSVG = [];
  let y = HEADER_HEIGHT;
  for (let [index, task] of tasks.entries()) {
    const taskBegin = (task.startDate - firstDate) / millisecondInDay;
    const x = (TASK_LABEL_WIDTH + taskBegin * xStep).toString() + "%";

    const width =
      (
        ((task.endDate - task.startDate) / millisecondInDay + 1) *
        xStep
      ).toString() + "%";
    //console.log(task, taskBegin, x, width);
    tasksSVG.push(
      <Task
        task={task}
        y={y}
        x={x}
        width={width}
        key={index}
        index={index}
        height={TASK_HEIGHT}
      />
    );
    y += TASK_HEIGHT;
  }
  console.log("Render diagram");
  return (
    <svg
      id='diagram'
      className={classes.diagram}
      height={TASK_HEIGHT * tasks.length + HEADER_HEIGHT}>
      {verticalLines}
      <line
        x1='0%'
        y1={HEADER_HEIGHT}
        x2='100%'
        y2={HEADER_HEIGHT}
        className={classes.hline}
      />
      {dates}
      {tasksSVG}
    </svg>
  );
};

export default Diagram;
