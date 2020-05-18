import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../Button/Button';
import classes from './signupDlg.module.css';
import ModalDialog from '../modalDialog';

import Input from '../../Input/Input';

import { AppContext } from '../../../../contexts/appContext';
import * as actionTypes from '../../../../contexts/actionTypes';
import * as apiFunctions from '../../../../apiFunctions';
import { checkValidity, updateObject } from '../../../../shared/utility';

const SignUpDialog = () => {
  const { t } = useTranslation();
  const { appDispatch } = useContext(AppContext);

  const [signUpMessage, setSignUpMessage] = useState('');

  const [signUpForm, setSignUpForm] = useState({
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
    password1: {
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
    password2: {
      elementType: 'input',
      elementConfig: {
        type: 'password',
        placeholder: t('Password'),
      },
      label: t('Repeat Password'),
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
      type: actionTypes.HIDE_SIGNUP_DIALOG,
    });
  };

  const inputChangedHandler = (event, inputIdentifier) => {
    const updatedFormElement = updateObject(signUpForm[inputIdentifier], {
      value: event.target.value,
      valid: checkValidity(event.target.value, signUpForm[inputIdentifier].validation),
      touched: true,
    });
    const updatedOrderForm = updateObject(signUpForm, {
      [inputIdentifier]: updatedFormElement,
    });

    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }
    setSignUpForm(updatedOrderForm);
    setFormIsValid(formIsValid);
  };

  const signUpHandler = async () => {
    if (formIsValid) {
      if (signUpForm.password1.value !== signUpForm.password2.value) {
        setSignUpMessage(t('Entered different passwords'));
        return;
      }
      const authData = {
        userName: signUpForm.name.value,
        password: signUpForm.password1.value,
      };
      const response = await apiFunctions.signUp(authData);

      if (response.operationResponse.OperationStatus === 'Failed') {
        setSignUpMessage(t('This name exists already'));
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
          type: actionTypes.HIDE_SIGNUP_DIALOG,
        });
      }
    }
  };

  const loginHandler = () => {
    appDispatch({
      type: actionTypes.HIDE_SIGNUP_DIALOG,
    });
    appDispatch({
      type: actionTypes.SHOW_LOGIN_DIALOG,
    });
  };

  const formElementsArray = [];
  for (let key in signUpForm) {
    formElementsArray.push({
      id: key,
      config: signUpForm[key],
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
    <ModalDialog title={t('SignUp')}>
      <div className={classes.textInputs}>{formElements}</div>
      <div className={classes.signUpMessage}> {signUpMessage}</div>
      <div className={classes.buttonArea}>
        <Button clickHandler={loginHandler}>{t('Login')}</Button>
        <Button clickHandler={closeDialogHandler}>{t('Cancel')}</Button>
        <Button clickHandler={signUpHandler}>{t('SignUp')}</Button>
      </div>
    </ModalDialog>
  );
};

export default SignUpDialog;
