import { Component } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/angular';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { INITIAL_EVENTS, createEventId } from './event-utils';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'calendar-angular';

  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'timeGridDay,timeGridWeek,dayGridMonth,listWeek',
      right: 'today prev,next'
    },
    initialView: 'timeGridWeek',
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  };

  currentEvents: EventApi[] = [];

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const calendarApi = selectInfo.view.calendar;
    Swal.fire({
      title: 'Agregar un nuevo evento: ',
      input: 'text',
      inputPlaceHolder: 'Digite el nombre del evento',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Guardar',
      inputValidator: (value) => {
        if (!value) {
          value = 'Evento sin nombre';
          calendarApi.addEvent({
            id: createEventId(),
            title: value,
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay
          });
          Swal.fire({
            title: '¡Evento sin nombre creado correctamente!',
            icon: 'success'
          });
        } else {
          calendarApi.unselect();
          calendarApi.addEvent({
            id: createEventId(),
            title: value,
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay
          });
          Swal.fire({
            title: '¡El evento fue creado correctamente!',
            icon: 'success'
          });
        }
      }
    });
  }

  handleEventClick(clickInfo: EventClickArg) {
    Swal.fire({
      title: '¿Está seguro de borrar este evento?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí'
    }).then((result) => {
      clickInfo.event.remove();
    });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

}
