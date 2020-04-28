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
    const res = await apiFunctions.deleteTask(id);
    if (res === 'Success') {
      tasksDispatch({
        type: actionTypes.DELETE_TASK,
        id: id,
      });
    }
  };

  const doneTaskHandler = (id) => {
    tasksDispatch({
      type: actionTypes.DONE_TASK,
      id: id,
      value: true,
    });
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
