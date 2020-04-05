import React from "react";

import classes from "./Navigation.module.css";
import Logo from "../Logo/Logo";

const Navigation = props => {
  return (
    <nav className={classes.navigation} id={props.id}>>
      <Logo />
      Navigation
    </nav>
  );
};

export default Navigation;
