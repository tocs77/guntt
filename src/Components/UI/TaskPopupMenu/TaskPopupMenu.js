import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { AppContext } from '../../../contexts/appContext';
import { TasksContext } from '../../../contexts/taskContext';
import * as actionTypes from '../../../contexts/actionTypes';
import * as apiFunctions from '../../../apiFunctions';

import classes from './TaskPopupMenu.module.css';

const TaskPopupMenu = (props) => {
  const { appState, appDispatch } = useContext(AppContext);
  const { tasks, tasksDispatch } = useContext(TasksContext);
  const { t } = useTranslation();

  let selectedTask = null;

  for (let task of tasks) {
    if (task.id === props.id) {
      selectedTask = { ...task };
    }
  }

  const mouseEnterHandler = () => {
    if (appState.TaskPopupMenu.id !== null) {
      appDispatch({
        type: actionTypes.LOCK_TASK_POPUP_MENU,
      });
    }
  };

  const mouseLeaveHandler = () => {
    appDispatch({
      type: actionTypes.HIDE_TASK_POPUP_MENU,
      forced: true,
    });
  };

  const editTaksHandler = (id) => {
    appDispatch({
      type: actionTypes.HIDE_TASK_POPUP_MENU,
      forced: true,
    });
    appDispatch({
      type: actionTypes.SHOW_EDIT_TASK_DIALOG,
      id: id,
    });
  };

  const doneTaskHandler = async (id) => {
    appDispatch({
      type: actionTypes.HIDE_TASK_POPUP_MENU,
      forced: true,
    });
    const response = await apiFunctions.updateTask({ id: id, done: true }); //! Maybe need to pass task to done function
    if (response.operationResponce.OperationStatus === 'Success') {
      tasksDispatch({
        type: actionTypes.DONE_TASK,
        id: response.task.id,
        value: response.task.done,
      });
    }
  };

  const deleteTaskHandler = async (id) => {
    appDispatch({
      type: actionTypes.HIDE_TASK_POPUP_MENU,
      forced: true,
    });

    const response = await apiFunctions.deleteTask(id);
    if (response.operationResponce.OperationStatus === 'Success') {
      tasksDispatch({
        type: actionTypes.DELETE_TASK,
        id: id,
      });
    }
  };

  return (
    <div
      className={classes.popupMenu}
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
      style={{ top: props.y, left: props.x }}
    >
      <div className={classes.header}>{selectedTask.task}</div>
      <div className={classes.submenu} onClick={() => editTaksHandler(selectedTask.id)}>
        {t('Edit')}
      </div>
      <div className={classes.submenu} onClick={() => doneTaskHandler(selectedTask.id)}>
        {t('Done')}
      </div>
      <div className={classes.submenu} onClick={() => deleteTaskHandler(selectedTask.id)}>
        {t('Delete')}
      </div>
    </div>
  );
};

export default TaskPopupMenu;
