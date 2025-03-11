// src/components/Clock/Clock.js

import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Update the time every second
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(timerId);
  }, []);

  // Format the current time as a locale-specific string (e.g., HH:MM:SS AM/PM)
  const formattedTime = time.toLocaleTimeString();

  return (
    <div
      className="clock"
      style={{
        padding: '20px',
        width: '200px', // fixed width to prevent resizing
        boxSizing: 'border-box'
      }}
    >
      <img
        src="/timeLogo.png"
        alt="Time Logo"
        style={{
          height: '60px',
          marginBottom: '10px',
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      />
      <p style={{ fontSize: '2em', textAlign: 'center', margin: 0 }}>
        {formattedTime}
      </p>
    </div>
  );
};

export default Clock;
