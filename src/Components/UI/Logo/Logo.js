import React from "react";

import classes from "./Logo.module.css";

import appLogo from "../../../assests/images/logo.png";

const logo = () => {
  return (
    <div className={classes.logo}>
      <img className={classes.logo_img} src={appLogo} alt='Logo' />
    </div>
  );
};

export default logo;
