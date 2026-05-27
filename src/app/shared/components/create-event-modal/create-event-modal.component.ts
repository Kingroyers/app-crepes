import { Component, Input } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-create-event-modal',
  templateUrl: './create-event-modal.component.html',
  styleUrls: ['./create-event-modal.component.scss'],
  standalone: false,
})
export class CreateEventModalComponent {
  @Input() dateStr = '';

  constructor(private readonly modalCtrl: ModalController, private readonly navSrv: NavController) { }

  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  selectType(type: 'evento' | 'tarea') {

    if (type == 'evento') {
      this.navSrv.navigateRoot('notes')
    } else if (type == 'tarea') {
      this.navSrv.navigateRoot('add-task')
    }
    this.modalCtrl.dismiss({ type, date: this.dateStr }, 'confirm');
  }
}
