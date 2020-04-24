import React, { useContext } from 'react';

import Task from './Task/Task';
import DayGrid from './DayGrid/DayGrid';

import classes from './Diagram.module.css';

import { TasksContext } from '../../contexts/taskContext';

import { makePercentString } from '../../shared/utility';

const millisecondInDay = 1000 * 3600 * 24;

const TASK_LABEL_WIDTH = 20; // 20% task labels width
const TASK_HEIGHT = 30; //? Task height in pixels  Maybe in procents?
const HEADER_HEIGHT = 50;

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

  let daysAmount = Math.floor((lastDate - firstDate) / millisecondInDay + 1);

  const xStep = (100 - TASK_LABEL_WIDTH) / daysAmount;

  const tasksSVG = [];
  let y = HEADER_HEIGHT;
  for (let [index, task] of tasks.entries()) {
    const taskBegin = (task.startDate - firstDate) / millisecondInDay;
    const x = makePercentString(TASK_LABEL_WIDTH + taskBegin * xStep);

    const width = makePercentString(
      ((task.endDate - task.startDate) / millisecondInDay + 1) * xStep
    );
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
  //console.log('Render diagram');
  return (
    <svg
      id='diagram'
      className={classes.diagram}
      height={TASK_HEIGHT * tasks.length + HEADER_HEIGHT}
    >
      <line
        x1='0%'
        y1={HEADER_HEIGHT}
        x2='100%'
        y2={HEADER_HEIGHT}
        className={classes.hline}
      />
      <DayGrid
        firstDate={firstDate}
        headerHeight={HEADER_HEIGHT}
        headerBeginValue={TASK_LABEL_WIDTH}
        xStep={xStep}
        daysAmount={daysAmount}
      />
      {tasksSVG}
    </svg>
  );
};

export default Diagram;
