import React from 'react';

export const Template = ({ props }) => {
  var { reconnectionAttempts } = props;
  return (
    <div className="server-error"><h1>Server Error</h1><span>The client has lost the connection from the server and has timed out after {reconnectionAttempts} reconnect attempts. Please check the server and reload this page.</span></div>
  );
};