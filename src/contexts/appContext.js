import React from "react";
import * as actionTypes from "./actionTypes";

export const initialState = {
  showAddModal: false
};

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_ADD_TASK_DIALOG:
      state = { ...state };
      state.showAddModal = true;
      return state;
    case actionTypes.HIDE_ADD_TASK_DIALOG:
      state = { ...state };
      state.showAddModal = false;
      return state;
    default:
      return state;
  }
};

export const AppContext = React.createContext();
