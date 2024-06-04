import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import 'moment/locale/en-gb';

moment.locale('en-gb');

const MyCalendar = ({ date, onDateChange, todoDates, activeStartDate }) => {
  const tileContent = ({ date, view }) => {
    if (view === 'month' && todoDates.includes(date.toISOString().split('T')[0])) {
      return <div style={{ position: 'relative', top: '5px', left: '5px', width: '10px', height: '10px', backgroundColor: 'skyblue', borderRadius: '50%' }}></div>;
    }
  };

  return (
    <div>
      <Calendar
        onChange={onDateChange}
        value={date}
        tileContent={tileContent}
        activeStartDate={activeStartDate}
        onActiveStartDateChange={({ activeStartDate }) => onDateChange(activeStartDate)}
        locale="en-GB"
      />
    </div>
  );
};

export default MyCalendar;
