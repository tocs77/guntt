import React from "react";

import classes from "./modalDialog.module.css";

const modalDialog = (props) => {
  return (
    <div className={classes.modal}>
      <div className={classes.modal_content}>
        <div className={classes.title}>{props.title}</div>
        <div>
            {props.children}
        </div>
        </div>
      </div>

  );
};

export default modalDialog;
