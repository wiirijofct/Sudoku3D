import React from 'react';

const Info = ({ wrongCount }) => (
  <div id="info">
    <p>Wrong Choices: <span id="wrongCount">{wrongCount}</span></p>
    {/* Other info content */}
  </div>
);

export default Info;