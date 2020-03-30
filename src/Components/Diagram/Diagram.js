import React from "react";

import Text from "./Text/Text";

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
    startDate: new Date("March 27, 2020 00:00:00"),
    endDate: new Date("March 29, 2020 00:00:00"),
    task: "Find key"
  }
];

const width = 600;
const height = 300;
const millisecondInDay = 1000 * 3600 * 24;

const Diagram = props => {
  let firstDate = tasks[0].startDate;
  let lastDate = tasks[0].endDate;
  for (let task of tasks) {
    firstDate = task.startDate < firstDate ? task.startDate : firstDate;
    lastDate = task.endDate > lastDate ? task.endDate : lastDate;
  }

  let daysAmount = (lastDate - firstDate) / millisecondInDay;

  const style = {
    border: "1px solid black"
  };

  const xStep = 100 / daysAmount;

  const lines = [];
  const dates = [];

  let currentDate = firstDate;
  for (let d = 0; d < daysAmount; d++) {
    let xCoord = (d * xStep).toString() + "%";
    let textCoord = (d * xStep + xStep / 3).toString() + "%";
    console.log(xCoord);
    lines.push(
      <line key={d} x1={xCoord} y1="0" x2={xCoord} y2="300" stroke="black" />
    );
    dates.push(
      <Text key={d} x={textCoord} y={15} text={currentDate.getDate()} />
    );

    currentDate.setDate(currentDate.getDate() + 1);
  }
  return (
    <svg id="diagram" className={classes.diagram} style={style}>
      {lines}
      {dates}
    </svg>
  );
};

export default Diagram;
