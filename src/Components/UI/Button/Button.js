import React from "react";

import cx from "classnames";

import classes from "./Button.module.css";

const button = props => {
  const btnClasses = [classes.button];
  const txtClasses = [classes.button_text];

  if (props.size === "small") {
    btnClasses.push(classes.button_small);
    txtClasses.push(classes.button_text_small);
  }

  return (
    <div className={cx(...btnClasses)} onClick={props.clickHandler}>
      <div className={cx(...txtClasses)}>{props.children}</div>
    </div>
  );
};

export default button;
