import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../Button/Button';
import classes from './loginDlg.module.css';
import ModalDialog from '../modalDialog';

import Input from '../../Input/Input';

import { AppContext } from '../../../../contexts/appContext';
import * as actionTypes from '../../../../contexts/actionTypes';
import * as apiFunctions from '../../../../apiFunctions';
import { checkValidity, updateObject } from '../../../../shared/utility';

const LoginDialog = () => {
  const { t } = useTranslation();
  const { appDispatch } = useContext(AppContext);

  const [loginMessage, setLoginMessage] = useState('');

  const [loginForm, setLoginForm] = useState({
    name: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: t('Name'),
      },
      label: t('Name'),
      value: '',
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    password: {
      elementType: 'input',
      elementConfig: {
        type: 'password',
        placeholder: t('Password'),
      },
      label: t('Password'),
      value: '',
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
  });

  const [formIsValid, setFormIsValid] = useState(false);

  const closeDialogHandler = () => {
    appDispatch({
      type: actionTypes.HIDE_LOGIN_DIALOG,
    });
  };

  const inputChangedHandler = (event, inputIdentifier) => {
    const updatedFormElement = updateObject(loginForm[inputIdentifier], {
      value: event.target.value,
      valid: checkValidity(event.target.value, loginForm[inputIdentifier].validation),
      touched: true,
    });
    const updatedOrderForm = updateObject(loginForm, {
      [inputIdentifier]: updatedFormElement,
    });

    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }
    setLoginForm(updatedOrderForm);
    setFormIsValid(formIsValid);
  };

  const loginHandler = async () => {
    if (formIsValid) {
      const authData = {
        userName: loginForm.name.value,
        password: loginForm.password.value,
      };
      const response = await apiFunctions.authenticate(authData);

      if (response.operationResponse.OperationStatus === 'Failed') {
        setLoginMessage(t('Incorrect name or password'));
        return;
      }

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

        appDispatch({
          type: actionTypes.HIDE_LOGIN_DIALOG,
        });
      }
    }
  };

  const signUpHandler = () => {
    appDispatch({
      type: actionTypes.HIDE_LOGIN_DIALOG,
    });
    appDispatch({
      type: actionTypes.SHOW_SIGNUP_DIALOG,
    });
  };

  const formElementsArray = [];
  for (let key in loginForm) {
    formElementsArray.push({
      id: key,
      config: loginForm[key],
    });
  }
  const formElements = formElementsArray.map((formElement) => (
    <Input
      key={formElement.id}
      elementType={formElement.config.elementType}
      elementConfig={formElement.config.elementConfig}
      value={formElement.config.value}
      invalid={!formElement.config.valid}
      shouldValidate={formElement.config.validation}
      touched={formElement.config.touched}
      label={formElement.config.label}
      changed={(event) => inputChangedHandler(event, formElement.id)}
    />
  ));

  return (
    <ModalDialog title={t('Login')}>
      <div className={classes.textInputs}>{formElements}</div>
      <div className={classes.loginMessage}> {loginMessage}</div>
      <div className={classes.buttonArea}>
        <Button clickHandler={signUpHandler}>{t('SignUp')}</Button>
        <Button clickHandler={closeDialogHandler}>{t('Cancel')}</Button>
        <Button clickHandler={loginHandler}>{t('Login')}</Button>
      </div>
    </ModalDialog>
  );
};

export default LoginDialog;
