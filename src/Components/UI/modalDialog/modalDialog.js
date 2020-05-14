import React, { useState, useEffect } from 'react';

import classes from './modalDialog.module.css';

const ModalDialog = (props) => {
  const [cssClass, setCssClass] = useState(classes.modal_content);

  useEffect(() => {
    setCssClass(classes.modal_content_visible);
    console.log('Use effect worked', cssClass);
  }, [cssClass]);

  return (
    <div className={classes.modal}>
      <div className={cssClass}>
        <div className={classes.title}>{props.title}</div>
        <div>{props.children}</div>
      </div>
    </div>
  );
};

export default ModalDialog;
