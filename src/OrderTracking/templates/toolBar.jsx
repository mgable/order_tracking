import React from 'react';

export const Template = (props) => {
  var { label, total, visible  } = props;
  return (
    <span>{label} (<span title='total'>{total}</span> / <span title="visible">{visible}</span>)</span>
  );
};