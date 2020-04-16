import React from 'react';
import * as actionTypes from './actionTypes';

import { updateObject } from '../shared/utility';

export const initialState = {
  showAddModal: false,
  TaskPopupMenu: {
    show: false,
    x: null,
    y: null,
    taskID: null,
    locked: false, // uses for not hiding task when mouse leaves task but on popup
  },
};

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_ADD_TASK_DIALOG:
      return updateObject(state, { showAddModal: true });

    case actionTypes.HIDE_ADD_TASK_DIALOG:
      return updateObject(state, { showAddModal: false });

    case actionTypes.SHOW_TASK_POPUP_MENU:
      return updateObject(state, {
        TaskPopupMenu: {
          show: true,
          x: action.x,
          y: action.y,
          taskID: action.taskID,
          locked: false,
        },
      });

    case actionTypes.HIDE_TASK_POPUP_MENU:
      if (state.TaskPopupMenu.locked && !action.forced) {
        return state;
      }

      return updateObject(state, {
        TaskPopupMenu: {
          show: false,
          x: null,
          y: null,
          taskID: null,
          locked: false,
        },
      });

    case actionTypes.LOCK_TASK_POPUP_MENU:
      const newTaskMenu = updateObject(state.TaskPopupMenu, { locked: true });
      return updateObject(state, { TaskPopupMenu: newTaskMenu });

    default:
      return state;
  }
};

export const AppContext = React.createContext();
