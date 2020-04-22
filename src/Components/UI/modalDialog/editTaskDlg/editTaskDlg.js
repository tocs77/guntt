import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../Button/Button';
import classes from './editTaskDlg.module.css';
import ModalDialog from '../modalDialog';

import Input from '../../Input/Input';

import { AppContext } from '../../../../contexts/appContext';
import { TasksContext } from '../../../../contexts/taskContext';
import * as actiontypes from '../../../../contexts/actionTypes';
import { checkValidity, updateObject, dateToString } from '../../../../shared/utility';

const EditTaskDialog = () => {
  const { t } = useTranslation();
  const { appState, appDispatch } = useContext(AppContext);
  const { tasks, tasksDispatch } = useContext(TasksContext);

  let selectedTask = null;

  for (let task of tasks) {
    if (task.id === appState.editModal.taskID) {
      selectedTask = { ...task };
    }
  }

  const [editForm, setEditForm] = useState({
    task: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: t('Task'),
      },
      label: t('Task'),
      value: selectedTask.task,
      validation: {
        required: true,
      },
      valid: true,
      touched: false,
    },
    startDate: {
      elementType: 'input',
      elementConfig: {
        type: 'date',
        placeholder: t('StartDate'),
      },
      label: t('StartDate'),
      value: dateToString(selectedTask.startDate),
      validation: {
        required: true,
      },
      valid: true,
      touched: false,
    },
    endDate: {
      elementType: 'input',
      elementConfig: {
        type: 'date',
        placeholder: t('EndDate'),
      },
      label: t('EndDate'),
      value: dateToString(selectedTask.endDate),
      validation: {
        required: true,
      },
      valid: true,
      touched: false,
    },
  });

  const [formIsValid, setFormIsValid] = useState(true);

  const closeDialogHandler = () => {
    appDispatch({
      type: actiontypes.HIDE_EDIT_TASK_DIALOG,
    });
  };

  const inputChangedHandler = (event, inputIdentifier) => {
    const updatedFormElement = updateObject(editForm[inputIdentifier], {
      value: event.target.value,
      valid: checkValidity(event.target.value, editForm[inputIdentifier].validation),
      touched: true,
    });
    const updatedEditForm = updateObject(editForm, {
      [inputIdentifier]: updatedFormElement,
    });

    let formIsValid = true;
    for (let inputIdentifier in updatedEditForm) {
      formIsValid = updatedEditForm[inputIdentifier].valid && formIsValid;
    }
    setEditForm(updatedEditForm);
    setFormIsValid(formIsValid);
  };

  const editTaskHandler = () => {
    if (formIsValid) {
      tasksDispatch({
        type: actiontypes.EDIT_TASK,
        id: selectedTask.id,
        task: editForm.task.value,
        startDate: new Date(Date.parse(editForm.startDate.value)),
        endDate: new Date(Date.parse(editForm.endDate.value)),
      });

      appDispatch({
        type: actiontypes.HIDE_EDIT_TASK_DIALOG,
      });
    }
  };

  const formElementsArray = [];
  for (let key in editForm) {
    formElementsArray.push({
      id: key,
      config: editForm[key],
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
    <ModalDialog title={t('Edit')}>
      <div className={classes.textInputs}>{formElements}</div>
      <div className={classes.buttonArea}>
        <Button clickHandler={closeDialogHandler}>{t('Cancel')}</Button>
        <Button clickHandler={editTaskHandler}>{t('Edit')}</Button>
      </div>
    </ModalDialog>
  );
};

export default EditTaskDialog;
