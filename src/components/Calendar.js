// import React from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import moment from 'moment';
// import 'moment/locale/en-gb';
// import './Calendar.css';

// moment.locale('en-gb');

// const MyCalendar = ({ date, onDateChange, activeStartDate }) => {
//   return (
//     <div className="calendar-container">
//       <Calendar
//         onChange={onDateChange}
//         value={date}
//         activeStartDate={activeStartDate}
//         onActiveStartDateChange={({ activeStartDate }) => onDateChange(activeStartDate)}
//         locale="en-GB"
//         className="custom-calendar"
//       />
//     </div>
//   );
// };

// export default MyCalendar;

import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import 'moment/locale/en-gb';
import './Calendar.css';

moment.locale('en-gb');

const MyCalendar = ({ date, onDateChange, activeStartDate, tileContent }) => {
  return (
    <div className="calendar-container">
      <Calendar
        onChange={onDateChange}
        value={date}
        activeStartDate={activeStartDate}
        onActiveStartDateChange={({ activeStartDate }) => onDateChange(activeStartDate)}
        locale="en-GB"
        className="custom-calendar"
        tileContent={tileContent}
      />
    </div>
  );
};

export default MyCalendar;
