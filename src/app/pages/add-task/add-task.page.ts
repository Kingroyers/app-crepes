import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Task } from '../../shared/services/task/task';
import { NavController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { AlertService } from 'src/app/core/providers/alert/alert.service';
import { ITask } from 'src/app/interfaces/task.interface';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
  standalone: false
})
export class AddTaskPage implements OnInit {

  title!: FormControl;
  limitDate!: FormControl;
  description!: FormControl;
  link!: FormControl;
  important!: FormControl;

  FormTask!: FormGroup;

  minDate!: string;

  editMode = false;
  editDocId = '';

  constructor(
    private readonly taskSrv: Task,
    private readonly navSrv: NavController,
    private readonly alertSrv: AlertService
  ) {
    this.initForm()
  }

  ngOnInit() {
    const now = new Date().toISOString()
    const nowCol = formatDate(now, "yyyy-MM-ddTHH:mm:ss", 'es-CO', '-0500');
    this.minDate = nowCol;

    const state = history.state;
    if (state?.editMode && state?.task) {
      this.editMode = true;
      this.editDocId = state.docId || '';
      const task: ITask = state.task;
      this.title.setValue(task.title);
      this.limitDate.setValue(task.limitDate);
      this.description.setValue(task.description);
      this.link.setValue(task.link || '');
      this.important.setValue(task.important);
    }
  }

  private initForm(){
    const now = new Date().toISOString()

    const nowCol = formatDate(now, "yyyy-MM-ddTHH:mm:ss", 'es-CO', '-0500');

    this.title = new FormControl('', [Validators.required]);
    this.limitDate = new FormControl(nowCol, [Validators.required]);
    this.description = new FormControl('', [Validators.required]);
    this.link = new FormControl('');
    this.important = new FormControl('no');

    this.FormTask = new FormGroup({
      title: this.title,
      limitDate: this.limitDate,
      description: this.description,
      link: this.link,
      important: this.important
    })
  }

  public async addTask() {
    if (this.limitDate.value < this.minDate) {
      this.alertSrv.warning('Fecha inválida', 'La fecha de finalización no puede ser menor a la actual');
      return;
    }

    if (this.editMode && this.editDocId) {
      try {
        await this.taskSrv.updateTask(this.editDocId, this.FormTask.value);
        this.alertSrv.toast('Tarea actualizada exitosamente');
        this.navSrv.navigateRoot('home');
      } catch (error) {
        this.alertSrv.error('Error', 'No se pudo actualizar la tarea. Inténtalo de nuevo.');
      }
      return;
    }

    await this.taskSrv.createTask(this.FormTask.value)
      .then(() => {
        this.alertSrv.toast('Tarea creada exitosamente');
        this.navSrv.navigateRoot('home');
      })
      .catch((error) => {
        console.log(error);
        this.alertSrv.error('Error', 'No se pudo crear la tarea. Inténtalo de nuevo.');
      });
  }

}
