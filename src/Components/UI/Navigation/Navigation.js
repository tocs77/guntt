import React, { useContext } from "react";

import classes from "./Navigation.module.css";
import Logo from "../Logo/Logo";
import Button from "../Button/Button";

import { AppContext } from "../../../contexts/appContext";
import * as actiontypes from "../../../contexts/actionTypes";

const Navigation = props => {
  const { appDispatch } = useContext(AppContext);

  const addTaskHandler = () => {
    appDispatch({
      type: actiontypes.SHOW_ADD_TASK_DIALOG
    });
  };
  return (
    <nav className={classes.navigation} id={props.id}>
      <Logo />
      <div className={classes.button_block}>
        <Button>Use filter</Button>
        <Button clickHandler={addTaskHandler}>Add Task</Button>
        <Button>Login</Button>
      </div>
    </nav>
  );
};

export default Navigation;
