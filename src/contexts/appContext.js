import React from 'react';
import * as actionTypes from './actionTypes';

import { updateObject } from '../shared/utility';

export const initialState = {
  showAddModal: false,
  editModal: {
    show: false,
    taskID: null,
  },
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

    case actionTypes.SHOW_EDIT_TASK_DIALOG:
      const newEditMenu = updateObject(state.editModal, { show: true, taskID: action.id });
      return updateObject(state, { editModal: newEditMenu });

    case actionTypes.HIDE_EDIT_TASK_DIALOG:
      return updateObject(state, { editModal: { show: false, taskID: null } });

    default:
      return state;
  }
};

export const AppContext = React.createContext();
