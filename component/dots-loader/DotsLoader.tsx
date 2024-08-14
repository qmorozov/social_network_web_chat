import React from 'react';
import Style from './DotsLoader.module.scss';

function DotsLoader() {
  return (
    <div className={Style.Animation}>
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </div>
  );
}

export default DotsLoader;
