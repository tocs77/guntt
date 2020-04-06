import React from "react";

import classes from "./Button.module.css";

const button = props => {
  return (
    <div className={classes.button} onClick={props.clickHandler}>
      <div className={classes.button_text}>{props.children}</div>
    </div>
  );
};

export default button;
