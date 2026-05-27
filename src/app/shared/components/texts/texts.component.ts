import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';
import { Categories } from '../../services/jsonsProviders';
import { Auth } from 'src/app/core/providers/auth/auth';
import { AlertService } from 'src/app/core/providers/alert/alert.service';
import { Task as TaskService } from '../../services/task/task';
import { DetailModalComponent } from '../detail-modal/detail-modal.component';

@Component({
  selector: 'app-texts',
  templateUrl: './texts.component.html',
  styleUrls: ['./texts.component.scss'],
  standalone: false,
})
export class TextsComponent implements OnInit {
  events: any[] = [];
  isLoading = true;

  private readonly accentColors = [
    '#6B4E3D', '#5A6B4E', '#4E5A6B', '#6B5A4E', '#7C6B4E', '#4E6B6B',
  ];

  constructor(
    private readonly crudSrv: Crud,
    private readonly authSrv: Auth,
    private readonly modalCtrl: ModalController,
    private readonly navSrv: NavController,
    private readonly alertSrv: AlertService,
    private readonly taskSrv: TaskService
  ) {}

  async ngOnInit() {

    try {

      const user = await this.authSrv.getCurrentUser();

      const uid = user?.userUid;

      const data = await this.crudSrv.getAll('tasks');
      if(data && uid){

        const task = await this.crudSrv.getByUid('tasks', uid);

        task != null ? this.events = task : console.log('No se encontraron tareas');



        // const now = new Date();
        // now.setHours(0, 0, 0, 0);

        // for (let i = 0; i < data.length; i++) {

        //   const task = await this.crudSrv.getByUid('tasks', uid);

        //   task != null ? this.events.push(task[i]): console.log('No evento');

        // }

        // console.log(this.events);

      }


      // if (data) {
      //   const now = new Date();
      //   now.setHours(0, 0, 0, 0);



      //   // this.events = data
      //   // .filter(e => new Date(e.start) >= now)
      //   //   .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      //   //   .slice(0, 10);
      // }
    } catch (err) {
      console.error('Error loading events:', err);
    } finally {
      this.isLoading = false;
    }
  }

  getAccentColor(index: number): string {
    return this.accentColors[index % this.accentColors.length];
  }

  getDayOfMonth(dateStr: string): string {
    return new Date(dateStr).getDate().toString().padStart(2, '0');
  }

  getMonthShort(dateStr: string): string {
    return new Date(dateStr)
      .toLocaleDateString('es-CO', { month: 'short' })
      .replace('.', '')
      .toUpperCase();
  }

  getDayLabel(dateStr: string): string {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const d = new Date(dateStr);
    const sameDay = (a: Date, b: Date) =>
      a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear();
    if (sameDay(d, today)) return 'Hoy';
    if (sameDay(d, tomorrow)) return 'Mañana';
    return '';
  }

  readonly skeletons = [1, 2, 3];

  async openTaskDetail(task: any) {
    const modal = await this.modalCtrl.create({
      component: DetailModalComponent,
      breakpoints: [0, 0.5, 0.75, 1],
      initialBreakpoint: 0.75,
      handle: false,
      cssClass: 'custom-modal',
      componentProps: { items: [task], type: 'tarea' }
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    if (role === 'edit' && data) {
      this.navSrv.navigateRoot('/add-task', {
        state: { editMode: true, docId: data.docId, task: data.item }
      });
    } else if (role === 'delete' && data?.docId) {
      try {
        await this.taskSrv.deleteTask(data.docId);
        this.alertSrv.toast('Tarea eliminada');
        this.events = this.events.filter((t: any) => (t.docId || t.id) !== data.docId);
      } catch {
        this.alertSrv.error('Error', 'No se pudo eliminar la tarea.');
      }
    }
  }
}
