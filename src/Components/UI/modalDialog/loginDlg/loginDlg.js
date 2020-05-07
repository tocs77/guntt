import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../Button/Button';
import classes from './loginDlg.module.css';
import ModalDialog from '../modalDialog';

import Input from '../../Input/Input';

import { AppContext } from '../../../../contexts/appContext';
import * as actionTypes from '../../../../contexts/actionTypes';
import { checkValidity, updateObject } from '../../../../shared/utility';
//import * as apiFunctions from '../../../../apiFunctions';

const LoginDialog = () => {
  const { t } = useTranslation();
  const { appDispatch } = useContext(AppContext);

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

  const loginHandler = () => {
    console.log('Login');
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
      <div className={classes.buttonArea}>
        <Button clickHandler={closeDialogHandler}>{t('Cancel')}</Button>
        <Button clickHandler={loginHandler}>{t('Login')}</Button>
      </div>
    </ModalDialog>
  );
};

export default LoginDialog;
