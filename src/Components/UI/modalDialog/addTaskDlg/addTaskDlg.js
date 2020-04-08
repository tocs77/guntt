import React, { useContext, useState } from "react";

import Button from "../../Button/Button";
import classes from "./addTaskDlg.module.css";
import ModalDialog from "../modalDialog";

import Input from "../../Input/Input";

import { AppContext } from "../../../../contexts/appContext";
import * as actiontypes from "../../../../contexts/actionTypes";
import { checkValidity, updateObject } from "../../../../shared/utility";

const AddTaskDialog = () => {
  const { appDispatch } = useContext(AppContext);
  const [addForm, setAddForm] = useState({
    task: {
      elementType: "input",
      elementConfig: {
        type: "text",
        placeholder: "Task"
      },
      label: "Task",
      value: "",
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    StartDate: {
      elementType: "input",
      elementConfig: {
        type: "text",
        placeholder: "Start Date"
      },
      label: "Start Date",
      value: "",
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    endDate: {
      elementType: "input",
      elementConfig: {
        type: "text",
        placeholder: "End Date"
      },
      label: "End Date",
      value: "",
      validation: {
        required: true
      },
      valid: false,
      touched: false
    }
  });

  const closeDialogHandler = () => {
    appDispatch({
      type: actiontypes.HIDE_ADD_TASK_DIALOG
    });
  };

  const inputChangedHandler = (event, inputIdentifier) => {
    const updatedFormElement = updateObject(addForm[inputIdentifier], {
      value: event.target.value,
      valid: checkValidity(
        event.target.value,
        addForm[inputIdentifier].validation
      ),
      touched: true
    });
    const updatedOrderForm = updateObject(addForm, {
      [inputIdentifier]: updatedFormElement
    });

    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }
    setAddForm(updatedOrderForm);
    //setFormIsValid(formIsValid);
  };

  const formElementsArray = [];
  for (let key in addForm) {
    formElementsArray.push({
      id: key,
      config: addForm[key]
    });
  }
  const formElements = formElementsArray.map(formElement => (
    <Input
      key={formElement.id}
      elementType={formElement.config.elementType}
      elementConfig={formElement.config.elementConfig}
      value={formElement.config.value}
      invalid={!formElement.config.valid}
      shouldValidate={formElement.config.validation}
      touched={formElement.config.touched}
      label={formElement.config.label}
      changed={event => inputChangedHandler(event, formElement.id)}
    />
  ));

  return (
    <ModalDialog title='Add Task'>
      <div className={classes.textInputs}>{formElements}</div>
      <div className={classes.buttonArea}>
        <Button clickHandler={closeDialogHandler}>Cancel</Button>
        <Button>Add task</Button>
      </div>
    </ModalDialog>
  );
};

export default AddTaskDialog;
