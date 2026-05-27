import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Event } from 'src/app/shared/services/event/event';
import { AlertService } from 'src/app/core/providers/alert/alert.service';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';
import { IEvents } from 'src/app/interfaces/events.interface';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
  standalone: false,
})
export class NotesPage implements OnInit {
  title!: FormControl;
  description!: FormControl;
  pdv!: FormControl;
  start!: FormControl;
  end!: FormControl;
  department!: FormControl;

  registerForm!: FormGroup;

  minDate!: string;

  savedEvent!: IEvents;

  editMode = false;
  editDocId = '';

  constructor(
    private readonly eventSrv: Event,
    private readonly navSrv: NavController,
    private readonly alertSrv: AlertService,
    private readonly crudSrv: Crud
  ) {
    this.initForm();
  }

  ngOnInit() {
    const now = new Date().toISOString()
    const nowCol = formatDate(now, "yyyy-MM-ddTHH:mm:ss", 'es-CO', '-0500');
    this.minDate = nowCol;

    const state = history.state;
    if (state?.editMode && state?.event) {
      this.editMode = true;
      this.editDocId = state.docId || '';
      const ev: IEvents = state.event;
      this.title.setValue(ev.title);
      this.description.setValue(ev.description);
      this.pdv.setValue(ev.pdv);
      this.start.setValue(ev.start);
      this.end.setValue(ev.end);
      this.department.setValue(ev.department);
    }
  }

  private initForm() {
    const now = new Date().toISOString()

    const nowCol = formatDate(now, "yyyy-MM-ddTHH:mm:ss", 'es-CO', '-0500');

    console.log(now);


    this.title = new FormControl('', [Validators.required]);
    this.description = new FormControl('', [Validators.required]);
    this.pdv = new FormControl('', [Validators.required]);
    this.start = new FormControl(nowCol, [Validators.required]);
    this.end = new FormControl(nowCol, [Validators.required]);
    this.department = new FormControl('', [Validators.required])

    this.registerForm = new FormGroup({
      title: this.title,
      description: this.description,
      pdv: this.pdv,
      start: this.start,
      end: this.end,
      department: this.department
    });
  }

  public async doSchedule() {
    if (new Date(this.end.value) <= new Date(this.start.value)) {
      this.alertSrv.warning('Fechas inválidas', 'El evento no puede terminar antes de la fecha inicial');
      return;
    }

    if (this.editMode && this.editDocId) {
      try {
        await this.eventSrv.updateEvent(this.editDocId, this.registerForm.value);
        this.alertSrv.toast('Evento actualizado exitosamente');
        this.navSrv.navigateRoot('home');
      } catch (error) {
        this.alertSrv.error('Error', 'No se pudo actualizar el evento. Inténtalo de nuevo.');
      }
      return;
    }

    try {

      const existingEvents: IEvents[] = await this.crudSrv.getByPdv('events', this.pdv.value) || [];

      const hasConflict = await this.checkEvents(this.start.value, this.end.value, existingEvents);

      if (hasConflict === true) {


        const newStart = new Date(this.start.value).getTime();
        const newEnd = new Date(this.end.value).getTime();

        for (let i = 0; i < existingEvents.length; i++) {
          const dateStartToConvert = existingEvents[i].start
          const dateStartToCompare = new Date(dateStartToConvert).getTime();

          const dateEndToConvert = existingEvents[i].end
          const dateEndToCompare = new Date(dateEndToConvert).getTime();

          if(newStart < dateEndToCompare && newEnd > dateStartToCompare){
            this.savedEvent = existingEvents[i]
            break;
          }

        }

        if (this.savedEvent.uid != null ) {

          const userConfirm = await this.alertSrv.showConflictDialog(this.savedEvent.responsible);
          if (userConfirm.isConfirmed) {
            const ev: IEvents = this.registerForm.value;
           await this.eventSrv.sendNotification(this.savedEvent.uid, `Solicitar compartir espacio a: ${this.savedEvent.responsible}`, ev);
            await this.navSrv.navigateRoot('home');
            this.alertSrv.toast('Notificación enviada', 'success');
          }else{
            this.alertSrv.toast('Crecion cancelada', 'info')
          }

        }
        return;
      } else if (hasConflict === false) {
        await this.eventSrv.createEvent(this.registerForm.value);
        this.alertSrv.toast('Evento creado exitosamente');
        this.navSrv.navigateRoot('home');
      }


    } catch (error) {
      console.error('Error al intentar agendar el evento:', error);
      this.alertSrv.error('Error', 'No se pudo crear el evento. Inténtalo de nuevo.');
    }
  }

  async checkEvents(newStart: string, newEnd: string, existentEvents: IEvents[]): Promise<boolean> {
    if (!existentEvents || existentEvents.length === 0) {
      console.log("No hay eventos en ese pdv");
      return false;
    }

    const newStartTime = new Date(newStart).getTime();
    const newEndTime = new Date(newEnd).getTime();

    if (isNaN(newStartTime) || isNaN(newEndTime)) {
      console.error('Las fechas del nuevo evento son inválidas.');
      return true;
    }

    return existentEvents.some(event => {
      const existingStart = new Date(event.start).getTime();
      const existingEnd = new Date(event.end).getTime();
      return (newStartTime < existingEnd) && (newEndTime > existingStart);
    });
  }

}

