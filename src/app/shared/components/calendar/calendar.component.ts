
import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular'
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { Categories } from '../../services/jsonsProviders';
import { IEvents } from 'src/app/interfaces/events.interface';
import { ModalController, NavController } from '@ionic/angular';
import { ModalComponent } from '../modal/modal.component';
import { DetailModalComponent } from '../detail-modal/detail-modal.component';
import { GlobalEvent } from '../../services/global-event';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';
import { AlertService } from 'src/app/core/providers/alert/alert.service';
import { Event as EventService } from '../../services/event/event';

//npm run start -- --host=0.0.0.0 --port:8100

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: false,
 /*  imports: [FullCalendarModule, CommonModule], */
})
export class CalendarComponent implements OnInit {

  events: IEvents[] = [];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    locale: esLocale,
    dayMaxEvents: 1,


    eventDisplay: 'block',

    moreLinkClick: (info) => {
      this.openModal(info.allSegs.map(s => s.event));
      return 'none';
    },
    eventContent: () => {
      return { html: '<span class="fc-custom-event">Evento</span>' };
    },
  dateClick: (arg: any) => {
      this.openCreatePrompt(arg);
    },
    eventClick: (arg: EventClickArg) => {
      this.openModal([arg.event]);
    },

  }

  async openModal(events: any[]) {

    const mappedEvents = events.map(ev => ({
      id: ev.id,
      title: ev.title,
      start: ev.start instanceof Date ? ev.start.toISOString() : ev.start,
      end: ev.end instanceof Date ? ev.end.toISOString() : ev.end,
      allDay: ev.allDay,
      ...ev.extendedProps
    }));

    const modal = await this.modalCtrl.create({
      component: DetailModalComponent,
      breakpoints: [0, 0.5, 0.75, 1],
      initialBreakpoint: mappedEvents.length === 1 ? 0.75 : 1,
      handle: false,
      cssClass: 'custom-modal',
      componentProps: {
        items: mappedEvents,
        type: 'evento'
      }
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    if (role === 'edit' && data) {
      this.navSrv.navigateRoot('/notes', {
        state: { editMode: true, docId: data.docId, event: data.item }
      });
    } else if (role === 'delete' && data?.docId) {
      try {
        await this.eventSrv.deleteEvent(data.docId);
        this.alertSrv.toast('Evento eliminado');
        await this.reloadEvents();
      } catch {
        this.alertSrv.error('Error', 'No se pudo eliminar el evento.');
      }
    }
  }

  private async reloadEvents() {
    const eventsData = await this.crudSrv.getAll<IEvents>('events');
    eventsData ? this.globaEventSrv.setEvents(eventsData) : null;

    if (eventsData) {
      this.events = eventsData.map(event => ({
        id: (event as any).id,
        title: event.title || 'Sin título',
        start: event.start,
        end: event.end,
        description: event.description || '',
        department: event.department || '',
        pdv: event.pdv || '',
        responsible: event.responsible || '',
        extendedProps: {
          pdv: event.pdv,
          description: event.description,
          department: event.department,
          responsible: event.responsible,
          uid: event.uid,
          docId: (event as any).id
        }
      }));
      this.calendarOptions = { ...this.calendarOptions, events: this.events };
    }
  }

  constructor(
    private readonly modalCtrl: ModalController,
    private readonly globaEventSrv: GlobalEvent,
    private readonly crudSrv: Crud,
    private readonly navSrv: NavController,
    private readonly alertSrv: AlertService,
    private readonly eventSrv: EventService
  ) { }

  async ngOnInit() {

    const eventsData = await this.crudSrv.getAll<IEvents>('events');
   eventsData ? this.globaEventSrv.setEvents(eventsData) : console.log('Sin Eventos');


  if (eventsData) {
    // Mapeamos los eventos a la interfaz
this.events = eventsData.map(event => ({
  id: (event as any).id,
  title: event.title || 'Sin título',
  start: event.start,
  end: event.end,

  description: event.description || '',
  department: event.department || '',
  pdv: event.pdv || '',
  responsible: event.responsible || '',

  extendedProps: {
    pdv: event.pdv,
    description: event.description,
    department: event.department,
    responsible: event.responsible,
    uid: event.uid,
    docId: (event as any).id
  }
}));
    this.calendarOptions = {
      ...this.calendarOptions,
      events: this.events
    };

    console.log('Eventos cargados:', this.events);
  }

//  if (events) {
//        events.forEach(event =>{

//         //  this.name = user.name;
//         //  this.lastName = user.lastName;
//         //  this.gender = user.gender;
//         //  this.img = user.images[0];

//          const eventR: IEvents = {
//          title: event.title,
//          pdv:  event.pdv,
//          start: event.start,
//          end: event.end,
//          description: event.description,
//          department: event.department
//         }
//         this.events = eventR;
//        });

//     console.log(this.events);
//       }

    // this.providerJsonSrv.getEvent().subscribe(e => {
    //   this.events = e;

    //   this.calendarOptions = {
    //     ...this.calendarOptions,
    //     events: this.events,
    //   }
    //   // console.log(e);
    //   // console.log(this.events);

    // });
    // console.log(this.events);

    // this.calendarOptions = {
    //   ...this.calendarOptions,
    //   events: this.events,
    // }
  };

  async openCreatePrompt(arg: any) {
    const clickedDate = new Date(arg.date);

    const today = new Date();

    today.setHours(0, 0, 0, 0);
    clickedDate.setHours(0, 0, 0, 0);

    if (clickedDate < today) {
      alert('No puedes crear eventos en fechas pasadas');
      return;
    }

    const { CreateEventModalComponent } = await import('../create-event-modal/create-event-modal.component');

    const modal = await this.modalCtrl.create({
      component: CreateEventModalComponent,
      cssClass: 'custom-create-modal',
      componentProps: {
        dateStr: arg.dateStr
      }
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    if (role === 'confirm' && data) {
      console.log('Tipo seleccionado:', data.type, 'Fecha:', data.date);
    }
  }

}
