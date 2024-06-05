import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import 'moment/locale/en-gb';

moment.locale('en-gb');

const MyCalendar = ({ date, onDateChange, activeStartDate }) => {
  return (
    <div style={{ width: '100%', height: 'auto' }}>
      <Calendar
        onChange={onDateChange}
        value={date}
        activeStartDate={activeStartDate}
        onActiveStartDateChange={({ activeStartDate }) => onDateChange(activeStartDate)}
        locale="en-GB"
        className="custom-calendar"
      />
    </div>
  );
};

export default MyCalendar;
