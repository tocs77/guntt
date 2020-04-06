import React, { useContext } from "react";

import classes from "./Navigation.module.css";
import Logo from "../Logo/Logo";
import Button from "../Button/Button";

import { Context } from "../../../store/reducers";
import * as actiontypes from "../../../store/actionTypes";

const Navigation = props => {
  const { dispatch } = useContext(Context);

  const addTaskHandler = () => {
    dispatch({
      type: actiontypes.ADD_TASK,
      task: {
        startDate: new Date("March 17, 2020 00:00:00"),
        endDate: new Date("April 1, 2020 00:00:00"),
        task: "Super new task"
      }
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
