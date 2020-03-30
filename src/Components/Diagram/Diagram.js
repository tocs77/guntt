import React from "react";

import Text from "./Text/Text";
import Task from "./Task/Task";

import classes from "./Diagram.module.css";

const tasks = [
  {
    startDate: new Date("March 27, 2020 00:00:00"),
    endDate: new Date("March 30, 2020 00:00:00"),
    task: "Develop SVG"
  },
  {
    startDate: new Date("March 15, 2020 00:00:00"),
    endDate: new Date("April 7, 2020 00:00:00"),
    task: "Buy Milk"
  },
  {
    startDate: new Date("March 20, 2020 00:00:00"),
    endDate: new Date("March 29, 2020 00:00:00"),
    task: "Find key"
  }
];

const millisecondInDay = 1000 * 3600 * 24;

const HEADER_HEIGHT = "15%";
const BODY_HEIGHT = 85; //! 85% paired constants
const TASK_WIDTH = 20; // 20% task labels width

const Diagram = props => {
  let firstDate = tasks[0].startDate;
  let lastDate = tasks[0].endDate;
  for (let task of tasks) {
    firstDate = task.startDate < firstDate ? task.startDate : firstDate;
    lastDate = task.endDate > lastDate ? task.endDate : lastDate;
  }

  let daysAmount = (lastDate - firstDate) / millisecondInDay + 1;

  const xStep = (100 - TASK_WIDTH) / daysAmount;

  const verticalLines = [];
  const dates = [];

  let currentDate = new Date(firstDate);

  for (let d = 0; d < daysAmount; d++) {
    let xCoord = (TASK_WIDTH + d * xStep).toString() + "%";
    let textCoord = (TASK_WIDTH + d * xStep + xStep / 3).toString() + "%";
    verticalLines.push(
      <line
        key={d}
        x1={xCoord}
        y1="0"
        x2={xCoord}
        y2="100%"
        className={classes.vline}
      />
    );
    dates.push(
      <Text key={d} x={textCoord} y="10%" text={currentDate.getDate()} />
    );

    currentDate.setDate(currentDate.getDate() + 1);
  }

  const tasksSVG = [];
  let y = 40;
  for (let task of tasks) {
    const taskBegin = (task.startDate - firstDate) / millisecondInDay;
    const x = (TASK_WIDTH + taskBegin * xStep).toString() + "%";

    const width =
      (
        ((task.endDate - task.startDate) / millisecondInDay + 1) *
        xStep
      ).toString() + "%";
    console.log(task, taskBegin, x, width);
    tasksSVG.push(
      <Task task={task.task} y={y} x={x} width={width} key={task.task} />
    );
    y += 30;
  }
  return (
    <svg id="diagram" className={classes.diagram}>
      {verticalLines}
      <line
        x1="0%"
        y1={HEADER_HEIGHT}
        x2="100%"
        y2={HEADER_HEIGHT}
        className={classes.hline}
      />
      {dates}
      {tasksSVG}
    </svg>
  );
};

export default Diagram;
