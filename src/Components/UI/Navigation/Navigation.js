import React, { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import classes from './Navigation.module.css';
import Logo from '../Logo/Logo';
import Button from '../Button/Button';

import { AppContext } from '../../../contexts/appContext';
import * as actiontypes from '../../../contexts/actionTypes';

const Navigation = (props) => {
  const { appState, appDispatch } = useContext(AppContext);

  const { t, i18n } = useTranslation();
  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
  };

  const addTaskHandler = () => {
    appDispatch({
      type: actiontypes.SHOW_ADD_TASK_DIALOG,
    });
  };

  const authenticateHandler = () => {
    appDispatch({
      type: actiontypes.SHOW_LOGIN_DIALOG,
    });
  };

  const logoutHandler = () => {
    appDispatch({
      type: actiontypes.APP_USER_EXIT,
    });
  };
  return (
    <nav className={classes.navigation} id={props.id}>
      <Logo />
      <div className={classes.language_button_block}>
        <Button size='small' clickHandler={() => changeLanguage('en-Us')}>
          En
        </Button>
        <Button size='small' clickHandler={() => changeLanguage('ru')}>
          Ru
        </Button>
      </div>
      <div className={classes.button_block}>
        {appState.isLogged ? <Button>{t('UseFilter')}</Button> : null}
        {appState.isLogged ? (
          <Button clickHandler={addTaskHandler}>{t('AddTask')}</Button>
        ) : null}

        {!appState.isLogged ? (
          <Button clickHandler={authenticateHandler}>{t('Login')}</Button>
        ) : (
          <Button clickHandler={logoutHandler}>{t('Logout')}</Button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
