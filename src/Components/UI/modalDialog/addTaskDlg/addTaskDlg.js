import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../Button/Button';
import classes from './addTaskDlg.module.css';
import ModalDialog from '../modalDialog';

import Input from '../../Input/Input';

import { AppContext } from '../../../../contexts/appContext';
import { TasksContext } from '../../../../contexts/taskContext';
import * as actionTypes from '../../../../contexts/actionTypes';
import { checkValidity, updateObject } from '../../../../shared/utility';
import * as apiFunctions from '../../../../apiFunctions';

const AddTaskDialog = () => {
  const { t } = useTranslation();
  const { appDispatch } = useContext(AppContext);
  const { tasksDispatch } = useContext(TasksContext);

  const [addForm, setAddForm] = useState({
    task: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: t('Task'),
      },
      label: t('Task'),
      value: '',
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    startDate: {
      elementType: 'input',
      elementConfig: {
        type: 'date',
        placeholder: t('StartDate'),
      },
      label: t('StartDate'),
      value: '',
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    endDate: {
      elementType: 'input',
      elementConfig: {
        type: 'date',
        placeholder: t('EndDate'),
      },
      label: t('EndDate'),
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
      type: actionTypes.HIDE_ADD_TASK_DIALOG,
    });
  };

  const inputChangedHandler = (event, inputIdentifier) => {
    const updatedFormElement = updateObject(addForm[inputIdentifier], {
      value: event.target.value,
      valid: checkValidity(event.target.value, addForm[inputIdentifier].validation),
      touched: true,
    });
    const updatedOrderForm = updateObject(addForm, {
      [inputIdentifier]: updatedFormElement,
    });

    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }
    setAddForm(updatedOrderForm);
    setFormIsValid(formIsValid);
  };

  const addTaskHandler = async () => {
    if (formIsValid) {
      const newTask = {
        task: addForm.task.value,
        startDate: addForm.startDate.value,
        endDate: addForm.endDate.value,
      };
      appDispatch({
        type: actionTypes.HIDE_ADD_TASK_DIALOG,
      });

      const response = await apiFunctions.addTask(newTask);
      if (response.operationResponce.OperationStatus === 'Success') {
        tasksDispatch({
          type: actionTypes.ADD_TASK,
          task: response.task,
        });
      }
    }
  };

  const formElementsArray = [];
  for (let key in addForm) {
    formElementsArray.push({
      id: key,
      config: addForm[key],
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
    <ModalDialog title={t('AddTask')}>
      <div className={classes.textInputs}>{formElements}</div>
      <div className={classes.buttonArea}>
        <Button clickHandler={closeDialogHandler}>{t('Cancel')}</Button>
        <Button clickHandler={addTaskHandler}>{t('AddTask')}</Button>
      </div>
    </ModalDialog>
  );
};

export default AddTaskDialog;
