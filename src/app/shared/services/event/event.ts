import { Injectable } from '@angular/core';
import { Auth } from 'src/app/core/providers/auth/auth';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';
import { IEvents } from 'src/app/interfaces/events.interface';


@Injectable({
  providedIn: 'root',
})
export class Event {
  constructor(private readonly crudSrv: Crud, private readonly AuthSrv: Auth) { }

  async createEvent(event: IEvents): Promise<void> {
    try {
      const user = await this.AuthSrv.getCurrentUser();
      console.log(user);

      const uid = user?.userUid;

      console.log(user?.userName, '||', user?.userUid);


      if (uid != null) {

        // Check for conflicts before creating
        // const conflictingEvent = await this.checkConflict(event);
        // if (conflictingEvent) {
        //   throw { code: 'conflict', event: conflictingEvent };
        // }

        await this.crudSrv.add('events', {
          uid,
          title: event.title,
          start: event.start,
          end: event.end,
          // allDay: event.allDay,
          description: event.description,
          department: event.department,
          responsible: user?.userName,
          pdv: event.pdv
        },);
        console.log('Funciona');

      } else {
        console.log("No uid no se agrega");
      }

    } catch (error) {
      console.log(error);
      throw error; // Re-throw to handle in component
    }
  }

  // async checkConflict(newEvent: IEvents): Promise<IEvents | null> {
  //   try {

  //     const newStart = new Date()

  //     // const existingEvents: any[] = await this.crudSrv.getByPdv('events', newEvent.pdv);

  //     // const newStart = new Date(newEvent.start).getTime();
  //     // const newEnd = new Date(newEvent.end).getTime();

  //     // for (const existingEvent of existingEvents) {
  //     //   const existingStart = new Date(existingEvent.start).getTime();
  //     //   const existingEnd = new Date(existingEvent.end).getTime();

  //     //   // Check if ranges overlap
  //     //   // Overlap if (StartA <= EndB) and (EndA >= StartB)
  //     //   // But strict inequality for open intervals? Usually [Start, End) or [Start, End].
  //     //   // "coincide in the database" implies any overlap.
  //     //   // Assuming [Start, End) for events usually.
  //     //   // (StartA < EndB) && (EndA > StartB) covers all overlap cases.
  //     //   if (newStart < existingEnd && newEnd > existingStart) {
  //     //     return existingEvent;
  //     //   }
  //     // }
  //     // return null;
  //   } catch (error) {
  //     console.error('Error checking conflict', error);
  //     return null;
  //   }
  // }

  async updateEvent(docId: string, event: Partial<IEvents>): Promise<void> {
    await this.crudSrv.update('events', docId, event);
  }

  async deleteEvent(docId: string): Promise<void> {
    await this.crudSrv.delete('events', docId);
  }

  async sendNotification(targetUid: string, message: string, event:IEvents): Promise<void> {
    try {
      const user = await this.AuthSrv.getCurrentUser();
      if (user && user.userUid) {
        await this.crudSrv.add('notifications', {
          type: 'ev',
          to: targetUid,
          from: user.userUid,
          message: message,
          date: new Date().toISOString(),
          read: false,
          event: {
            title: event.title,
            start: event.start,
            end: event.end,
            description: event.description,
            department: event.department,
            responsible: user.userName,
            pdv: event.pdv,
            uid: user.userUid
          }
        });
        console.log('Notification sent DB:', targetUid);

        // ─── Trigger Native Push Notification ───
        fetch('/api/send-push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetUid,
            title: 'Nuevo Evento Asignado',
            body: message,
            url: '/manage-user'
          })
        }).catch(err => console.warn('No se pudo enviar Push API', err));

      }
    } catch (error) {
      console.error('Error sending notification', error);
      throw error;
    }
  }

  async sendMessage(targetUid: string, message: string): Promise<void> {
    try {
      const user = await this.AuthSrv.getCurrentUser();
      if (user && user.userUid) {
        await this.crudSrv.add('notifications', {
          type: 'me',
          to: targetUid,
          from: user.userUid,
          message: message,
          date: new Date().toISOString(),
          read: false,
        });
        console.log('Notification message sent DB:', targetUid);

        // ─── Trigger Native Push Notification ───
        fetch('/api/send-push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetUid,
            title: 'Nueva Tarea Asignada',
            body: message,
            url: '/'
          })
        }).catch(err => console.warn('No se pudo enviar Push API', err));

      }
    } catch (error) {
      console.error('Error sending notification', error);
      throw error;
    }
  }
}
