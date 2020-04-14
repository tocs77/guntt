import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../Button/Button';

import classes from './TaskPanel.module.css';

const TaskPanel = (props) => {
  const { t } = useTranslation();
  return (
    <div
      onMouseEnter={props.mouseEnter}
      onMouseLeave={props.mouseLeave}
      className={classes.taskPanel}
    >
      <div className={classes.label}>{props.task.task}</div>
      <div className={classes.buttonContainer}>
        <Button clickHandler={props.doneTask} size='small'>
          {t('Done')}
        </Button>
        <Button clickHandler={props.deleteTask} size='small'>
          {t('Delete')}
        </Button>
      </div>
    </div>
  );
};

export default TaskPanel;
