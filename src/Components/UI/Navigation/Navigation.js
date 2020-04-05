import React from "react";

import classes from "./Navigation.module.css";
import Logo from "../Logo/Logo";
import Button from "../Button/Button";

const Navigation = props => {
  return (
    <nav className={classes.navigation} id={props.id}>
      <Logo />
      <div className={classes.button_block}>
        <Button>Use filter</Button>
        <Button>Add Task</Button>
        <Button>Login</Button>
      </div>
    </nav>
  );
};

export default Navigation;
