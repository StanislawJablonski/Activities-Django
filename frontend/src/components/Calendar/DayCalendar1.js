import React from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!

export default class DemoApp extends React.Component {
  render() {
    return (
      <FullCalendar
      plugins={[ dayGridPlugin ]}
      initialView="dayGridMonth"
      events={[
        { title: 'event 1', date: '2022-11-20' },
        { title: 'event 2', date: '2022-11-20' }
      ]}
      // option={{height: '50%'}}
      height
      />
    )
  }
}