import React from 'react';
import { useTranslation } from 'react-i18next';

import Text from '../Text/Text';

import { makePercentString } from '../../../shared/utility';
import classes from './DayGrid.module.css';

const DayGrid = (props) => {
  console.log(props.xStep)
  const { t } = useTranslation();

  const verticalLines = [];
  const dates = [];
  const months = [];
  const monthsLines = [];

  let currentDate = new Date(props.firstDate);
  let currentMonth = currentDate.toLocaleString('en', { month: 'long' });
  let currentMonthBegin = props.headerBeginValue;

  for (let d = 0; d < props.daysAmount; d++) {
    let xCoord = props.headerBeginValue + d * props.xStep;

    let textCoord = makePercentString(
      props.headerBeginValue + d * props.xStep + props.xStep / 2.2
    );
    if (currentDate.getDate() > 9) {
      // Move text to left for two digits numbers
      textCoord = makePercentString(
        props.headerBeginValue + d * props.xStep + props.xStep / 4
      );
    }

    verticalLines.push(
      <line
        key={d}
        x1={makePercentString(xCoord)}
        y1={props.headerHeight / 2}
        x2={makePercentString(xCoord)}
        y2='100%'
        className={classes.vline}
      />
    );
    dates.push(
      <Text
        key={d}
        x={textCoord}
        y={props.headerHeight / 2 + props.headerHeight / 3}
        text={currentDate.getDate()}
      />
    );

    currentDate.setDate(currentDate.getDate() + 1);
    const month = currentDate.toLocaleString('en', { month: 'long' });
    if (month !== currentMonth || d === props.daysAmount - 1) {
      const xMonthCoord = (currentMonthBegin + xCoord) / 2;
      months.push(
        <Text
          key={currentMonth}
          x={makePercentString(xMonthCoord)}
          y={props.headerHeight / 2 - props.headerHeight / 5}
          size='medium'
          text={t(currentMonth)}
        />
      );
      monthsLines.push(
        <line
          key={currentMonthBegin}
          x1={makePercentString(currentMonthBegin)}
          y1='0'
          x2={makePercentString(currentMonthBegin)}
          y2={props.headerHeight / 2}
          className={classes.vline}
        />
      );
      currentMonthBegin = xCoord;
      currentMonth = month;
    }
  }

  return (
    <React.Fragment>
      <line
        x1={makePercentString(props.headerBeginValue)}
        y1={props.headerHeight / 2}
        x2='100%'
        y2={props.headerHeight / 2}
        className={classes.vline}
      />
      {verticalLines}
      {dates}
      {months}
      {monthsLines}
    </React.Fragment>
  );
};

export default DayGrid;
