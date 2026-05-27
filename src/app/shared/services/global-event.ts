import { Injectable } from '@angular/core';
import { IEvents } from 'src/app/interfaces/events.interface';
import { INotification } from 'src/app/interfaces/notification.interface';

@Injectable({
  providedIn: 'root',
})
export class GlobalEvent {
  private uid: string = '';


  private events: IEvents[] = [];

  setUid(uid: string){
    this.uid = uid;
  }

  getUid(): string{
    return this.uid;
  }

  setEvents(events: IEvents[]){
    this.events = events;
  }

  getEvents(): IEvents[]{
    return this.events;
  }


  // private id: string = '';
  // private title: string = '';
  // private start: string = '';
  // private end: string = '';
  // private allDay: boolean = true;

  // setId(id: string){
  //   this.id = id;
  // }

  // getId(): string{
  //   return this.id;
  // }

  // setTitle(title: string){
  //   this.title = title;
  // }

  // getTitle(): string{
  //   return this.title;
  // }

  // setStart(start: string){
  //   this.start = start;
  // }

  // getStart(): string{
  //   return this.start;
  // }

  // setEnd(end: string){
  //   this.end = end;
  // }

  // getEnd(): string{
  //   return this.end;
  // }

  // setAllDay(allDay: boolean){
  //   this.allDay = allDay;
  // }

  // getAllDay(): boolean{
  //   return this.allDay;
  // }

}
