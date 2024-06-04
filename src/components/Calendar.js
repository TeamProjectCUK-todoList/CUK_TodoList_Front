import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import 'moment/locale/en-gb';

moment.locale('en-gb');

const MyCalendar = ({ date, onDateChange, todoDates, eventDates, activeStartDate }) => {
  const tileContent = ({ date, view }) => {
    const formattedDate = date.toISOString().split('T')[0];
    const isTodoDate = todoDates.includes(formattedDate);
    const isEventDate = eventDates.includes(formattedDate);

    return (
      <div style={{ position: 'relative' }}>
        {isTodoDate && (
          <div style={{
            position: 'absolute',
            top: '5px',
            left: '5px',
            width: '10px',
            height: '10px',
            backgroundColor: 'skyblue',
            borderRadius: '50%'
          }}></div>
        )}
        {isEventDate && (
          <div style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            width: '10px',
            height: '10px',
            backgroundColor: 'orange',
            borderRadius: '50%'
          }}></div>
        )}
      </div>
    );
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
