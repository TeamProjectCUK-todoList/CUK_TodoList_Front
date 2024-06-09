import React, { useEffect, useState } from 'react';
import './DigitalClock.css';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const today = time;

  const dateString = `${dayNames[today.getDay()]} ${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;

  let hours = today.getHours();
  const minutes = today.getMinutes() < 10 ? `0${today.getMinutes()}` : today.getMinutes();
  const seconds = today.getSeconds() < 10 ? `0${today.getSeconds()}` : today.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // hour '0' should be '12'
  const h = hours < 10 ? `0${hours}` : hours;

  return (
    <div className="clock-container">
      <div className="clock">
        <div id="Date">{dateString}</div>
        <div className="time-container">
          <span id="ampm">{ampm}</span>
          <ul>
            <li id="hour">{h}</li>
            <li id="point">:</li>
            <li id="min">{minutes}</li>
            <li id="point">:</li>
            <li id="sec">{seconds}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DigitalClock;
