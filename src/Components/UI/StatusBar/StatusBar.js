import React, { useContext } from 'react';

import classes from './StatusBar.module.css';
import { AppContext } from '../../../contexts/appContext';

const StatusBar = (props) => {
  const { appState } = useContext(AppContext);

  return (
    <div className={classes.statusBar} id={props.id}>
      <div className={classes.loginMessage}>
        {appState.isLogged ? 'Hello ' + appState.userName : 'Please login or sign in'}
      </div>
      <div className={classes.author}>Developed by Ilya Golubkov</div>
    </div>
  );
};

export default StatusBar;
