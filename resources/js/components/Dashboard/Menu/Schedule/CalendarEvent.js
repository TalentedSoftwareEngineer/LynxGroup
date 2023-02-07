import React from 'react';
import './Schedule.css';

// small component used for us to decide which piece of information in the event we want to display on the 
// calendar, in this case we only display the user name and title
export const CalendarEvent = ({event}) => {

    const {title} = event;

  return (
    <div style={{overflow: 'hidden'}}>
        <p className='event_title'>{title}</p>
    </div>
  )
}
