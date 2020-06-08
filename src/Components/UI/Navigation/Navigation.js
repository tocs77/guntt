import React, { useContext, useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import classes from './Navigation.module.css';
import Logo from '../Logo/Logo';
import Button from '../Button/Button';

import { AppContext } from '../../../contexts/appContext';
import * as apiFunctions from '../../../apiFunctions';
import * as actionTypes from '../../../contexts/actionTypes';

const Navigation = (props) => {
  const { appState, appDispatch } = useContext(AppContext);

  const { t, i18n } = useTranslation();
  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
  };

  useEffect(() => {
    async function f() {
      const response = await apiFunctions.checkToken(); //*Check if saved token still valid and
      if (response.operationResponse.OperationStatus === 'Success') {
        //*authentication won`t need
        appDispatch({
          type: actionTypes.SET_USER_NAME,
          userName: response.auth.userName,
        });
        appDispatch({
          type: actionTypes.APP_USER_ENTER,
        });
      }
    }
    f();
  }, [appDispatch]);

  const addTaskHandler = () => {
    appDispatch({
      type: actionTypes.SHOW_ADD_TASK_DIALOG,
    });
  };

  const authenticateHandler = () => {
    appDispatch({
      type: actionTypes.SHOW_SIGNUP_DIALOG,
    });
  };

  const logoutHandler = () => {
    appDispatch({
      type: actionTypes.APP_USER_EXIT,
    });
  };

  const demoHandler = async () => {
    var response = await apiFunctions.demoMode();
    if (response.operationResponse.OperationStatus === 'Success') {
      var token = response.auth.token;
      sessionStorage.setItem('authToken', token);
      appDispatch({
        type: actionTypes.APP_USER_ENTER,
      });
      appDispatch({
        type: actionTypes.SET_USER_NAME,
        userName: response.auth.userName,
      });
    }
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
        {appState.isLogged ? null : <Button clickHandler={demoHandler}>{t('Demo')}</Button>}

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
