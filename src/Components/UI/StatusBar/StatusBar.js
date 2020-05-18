import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import classes from './StatusBar.module.css';
import { AppContext } from '../../../contexts/appContext';

const StatusBar = (props) => {
  const { appState } = useContext(AppContext);
  const { t } = useTranslation();

  return (
    <div className={classes.statusBar} id={props.id}>
      <div className={classes.loginMessage}>
        {appState.isLogged ? t('Hello') + appState.userName : t('Please login or sign in')}
      </div>
      <div className={classes.author}>Developed by Ilya Golubkov</div>
    </div>
  );
};

export default StatusBar;
