import React, { useState, useEffect } from 'react';

const Timer = ({ isRunning, setIsRunning }) => {
    const [time, setTime] = useState(0);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1000);
      }, 1000);
    } else if (!isRunning && time !== 0) {
      clearInterval(interval);
      setTime(0);
    }

    return () => clearInterval(interval);
  }, [isRunning, time]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setTime(0);
    setIsRunning(false);
  };

    return (
        <div className="timer-container">
            <h3>{new Date(time).toISOString().slice(11, 19)}</h3>
        </div>
    );
};

export default Timer;