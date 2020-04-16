import React, { useContext } from 'react';

import { AppContext } from '../../../contexts/appContext';
import * as actiontypes from '../../../contexts/actionTypes';

import classes from './TaskPopupMenu.module.css';

const TaskPopupMenu = (props) => {
  const { appState, appDispatch } = useContext(AppContext);

  const mouseEnterHandler = () => {
    if (appState.TaskPopupMenu.taskId !== null) {
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
  return (
    <div
      className={classes.popupMenu}
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
      style={{ top: props.y, left: props.x }}
    >
      PopUp Menu
    </div>
  );
};

export default TaskPopupMenu;
