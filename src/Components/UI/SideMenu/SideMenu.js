import React, { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import classes from './SideMenu.module.css';

import TaskPanel from './TaskPanel/TaskPanel';

import { TasksContext } from '../../../contexts/taskContext';
import * as actionTypes from '../../../contexts/actionTypes';
import * as apiFunctions from '../../../apiFunctions';

const SideMenu = () => {
  const { tasks, tasksDispatch } = useContext(TasksContext);

  const { t } = useTranslation();

  const mouseEnterPanelHandler = (id) => {
    tasksDispatch({
      type: actionTypes.HIGHLIGHT_TASK,
      id: id,
      value: true,
    });
  };

  const mouseLeavePanelHandler = (id) => {
    tasksDispatch({
      type: actionTypes.HIGHLIGHT_TASK,
      id: id,
      value: false,
    });
  };

  const deleteTaskHandler = async (id) => {
    const response = await apiFunctions.deleteTask(id);
    if (response.operationResponce.OperationStatus === 'Success') {
      tasksDispatch({
        type: actionTypes.DELETE_TASK,
        id: id,
      });
    }
  };

  const doneTaskHandler = async (id) => {
    let taskToUpdate;

    for (let task of tasks) {
      if (task.id === id) {
        taskToUpdate = { ...task };
        break;
      }
    }
    taskToUpdate.done = true;
    const response = await apiFunctions.updateTask(taskToUpdate);
    if (response.operationResponce.OperationStatus === 'Success') {
      tasksDispatch({
        type: actionTypes.DONE_TASK,
        id: response.task.id,
        value: response.task.done,
      });
    }
  };

  const tasksElements = tasks.map((task) => {
    return (
      <TaskPanel
        task={task}
        key={task.id}
        mouseEnter={() => mouseEnterPanelHandler(task.id)}
        mouseLeave={() => mouseLeavePanelHandler(task.id)}
        deleteTask={() => deleteTaskHandler(task.id)}
        doneTask={() => doneTaskHandler(task.id)}
      ></TaskPanel>
    );
  });

  return (
    <div className={classes.sideMenu}>
      <div className={classes.header}>{t('Task')}</div>
      {tasksElements}
    </div>
  );
};

export default SideMenu;
