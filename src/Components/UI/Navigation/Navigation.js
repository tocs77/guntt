import React, { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import classes from './Navigation.module.css';
import Logo from '../Logo/Logo';
import Button from '../Button/Button';

import { AppContext } from '../../../contexts/appContext';
import * as actiontypes from '../../../contexts/actionTypes';
import * as apiFunctions from '../../../apiFunctions'

const Navigation = (props) => {
  const { appDispatch } = useContext(AppContext);

  const {t, i18n } = useTranslation();
  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
  };

  const addTaskHandler = () => {
    appDispatch({
      type: actiontypes.SHOW_ADD_TASK_DIALOG,
    });
  };


  const authenticateHandler = async() => {
    // const authData = {
    //   userName: "Alice",
    //   password: "11"
    // }
    // const response = await apiFunctions.authenticate(authData);
    // console.log(response)
    appDispatch({
      type: actiontypes.SHOW_LOGIN_DIALOG
    })
  }
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
        <Button>{t("UseFilter")}</Button>
  <Button clickHandler={addTaskHandler}>{t("AddTask")}</Button>
        <Button clickHandler={authenticateHandler}>{t("Login")}</Button>
      </div>
    </nav>
  );
};

export default Navigation;
