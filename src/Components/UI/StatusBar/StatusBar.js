import React from "react";

import classes from "./StatusBar.module.css";

const StatusBar = props => {
  return (
    <p className={classes.statusBar} id={props.id}>
      Status Bar
    </p>
  );
};

export default StatusBar;
