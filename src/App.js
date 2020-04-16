import React, { useReducer } from 'react';
import './App.css';

import Diagramm from './Components/Diagram/Diagram';
import Navigation from './Components/UI/Navigation/Navigation';
import SideMenu from './Components/UI/SideMenu/SideMenu';
import StatusBar from './Components/UI/StatusBar/StatusBar';
import AddTaskDialog from './Components/UI/modalDialog/addTaskDlg/addTaskDlg';

import { taskReducer, initialTasks, TasksContext } from './contexts/taskContext';

import { appReducer, initialState, AppContext } from './contexts/appContext';

function App() {
  const [tasks, tasksDispatch] = useReducer(taskReducer, initialTasks);
  const [appState, appDispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ appState, appDispatch }}>
      <TasksContext.Provider value={{ tasks, tasksDispatch }}>
        <Navigation id='navigation' />
        <SideMenu />
        <Diagramm />
        {appState.showAddModal ? <AddTaskDialog /> : null}
        <StatusBar id='statusBar' />
      </TasksContext.Provider>
    </AppContext.Provider>
  );
}

export default App;
