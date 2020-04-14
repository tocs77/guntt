import React from 'react';

import classes from './Text.module.css';

const Text = (props) => {
  let textClass = classes.small;

  if (props.size === 'medium') {
    textClass = classes.medium;
  }
  return (
    <text className={textClass} x={props.x} y={props.y}>
      {props.text}
    </text>
  );
};

export default Text;
