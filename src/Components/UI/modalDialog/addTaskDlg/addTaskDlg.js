import React, { useContext } from "react";

import Button from "../../Button/Button";
import classes from "./addTaskDlg.module.css";
import ModalDialog from "../modalDialog";

import { AppContext } from "../../../../contexts/appContext";
import * as actiontypes from "../../../../contexts/actionTypes";

const AddTaskDialog = () => {
  const { appDispatch } = useContext(AppContext);

  const closeDialogHandler = () => {
    appDispatch({
      type: actiontypes.HIDE_ADD_TASK_DIALOG
    });
  };
  return (
    <ModalDialog title='Add Task'>
      <div className={classes.textInputs}>
        <input
          type='text'
          name='task_name'
          className={classes.inputElement}
          placeholder='Task'
        />
        <input
          type='text'
          name='start_date'
          className={classes.inputElement}
          placeholder='Start Date'
        />
        <input
          type='text'
          name='end date'
          className={classes.inputElement}
          placeholder='End Date'
        />
      </div>
      <div className={classes.buttonArea}>
        <Button clickHandler={closeDialogHandler}>Cancel</Button>
        <Button>Add task</Button>
      </div>
    </ModalDialog>
  );
};

export default AddTaskDialog;
