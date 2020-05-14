import React, { useReducer } from 'react';
import './App.css';

import Diagramm from './Components/Diagram/Diagram';
import Navigation from './Components/UI/Navigation/Navigation';
import SideMenu from './Components/UI/SideMenu/SideMenu';
import StatusBar from './Components/UI/StatusBar/StatusBar';
import AddTaskDialog from './Components/UI/modalDialog/addTaskDlg/addTaskDlg';
import EditTaskDialog from './Components/UI/modalDialog/editTaskDlg/editTaskDlg';
import TaskPopupMenu from './Components/UI/TaskPopupMenu/TaskPopupMenu';
import LogindDialog from './Components/UI/modalDialog/loginDlg/loginDlg';
import SignUpDialog from './Components/UI/modalDialog/signupDlg/signupDlg';

import { taskReducer, TasksContext } from './contexts/taskContext';

import { appReducer, initialState, AppContext } from './contexts/appContext';

function App() {
  const [tasks, tasksDispatch] = useReducer(taskReducer, []);
  const [appState, appDispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ appState, appDispatch }}>
      <TasksContext.Provider value={{ tasks, tasksDispatch }}>
        <Navigation id='navigation' />
        <SideMenu />
        <Diagramm />
        {appState.showAddModal ? <AddTaskDialog /> : null}
        {appState.editModal.show ? <EditTaskDialog /> : null}
        {appState.showLoginModal ? <LogindDialog /> : null}
        {appState.showSigninModal ? <SignUpDialog /> : null}
        {appState.TaskPopupMenu.show ? (
          <TaskPopupMenu
            x={appState.TaskPopupMenu.x}
            y={appState.TaskPopupMenu.y}
            id={appState.TaskPopupMenu.taskID}
          />
        ) : null}
        <StatusBar id='statusBar' />
      </TasksContext.Provider>
    </AppContext.Provider>
  );
}

export default App;
