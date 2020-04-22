import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { AppContext } from '../../../contexts/appContext';
import { TasksContext } from '../../../contexts/taskContext';
import * as actiontypes from '../../../contexts/actionTypes';

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
        type: actiontypes.LOCK_TASK_POPUP_MENU,
      });
    }
  };

  const mouseLeaveHandler = () => {
    appDispatch({
      type: actiontypes.HIDE_TASK_POPUP_MENU,
      forced: true,
    });
  };

  const editTaksHandler = (id) => {
    appDispatch({
      type: actiontypes.HIDE_TASK_POPUP_MENU,
      forced: true,
    });
    appDispatch({
      type: actiontypes.SHOW_EDIT_TASK_DIALOG,
      id: id,
    });
  };

  const doneTaskHandler = (id) => {
    tasksDispatch({
      type: actiontypes.DONE_TASK,
      id: id,
      value: true,
    });
    appDispatch({
      type: actiontypes.HIDE_TASK_POPUP_MENU,
      forced: true,
    });
  };

  const deleteTaskHandler = (id) => {
    tasksDispatch({
      type: actiontypes.DELETE_TASK,
      id: id,
    });
    appDispatch({
      type: actiontypes.HIDE_TASK_POPUP_MENU,
      forced: true,
    });
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
