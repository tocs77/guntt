import React, { useReducer } from "react";
import "./App.css";

import Diagramm from "./Components/Diagram/Diagram";
import Navigation from "./Components/UI/Navigation/Navigation";
import SideMenu from "./Components/UI/SideMenu/SideMenu";
import StatusBar from "./Components/UI/StatusBar/StatusBar";
import AddTaskDialog from "./Components/UI/addTaskDlg/addTaskDlg";

import {
  taskReducer,
  initialTasks,
  TasksContext
} from "./contexts/taskContext";

import { appReducer, initialState, AppContext } from "./contexts/appContext";

function App() {
  const [tasks, tasksDispatch] = useReducer(taskReducer, initialTasks);
  const [appState, appDispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ appState, appDispatch }}>
      <Navigation id='navigation' />
      <SideMenu />
      <TasksContext.Provider value={{ tasks, tasksDispatch }}>
        <Diagramm />
      </TasksContext.Provider>
      <StatusBar id='statusBar' />
      {appState.showAddModal ? <AddTaskDialog /> : null}
    </AppContext.Provider>
  );
}

export default App;
