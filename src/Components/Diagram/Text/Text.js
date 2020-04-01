import React from "react";

import classes from "./Text.module.css";

const Text = props => {
  return (
    <text className={classes.small} x={props.x} y={props.y}>
      {props.text}
    </text>
  );
};

export default Text;