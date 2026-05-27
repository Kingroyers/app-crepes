import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonModal, ModalController } from '@ionic/angular';
import { GlobalEvent } from '../../services/global-event';
import { IEvents } from 'src/app/interfaces/events.interface';
import { DetailModalComponent } from '../detail-modal/detail-modal.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: false
})
export class ModalComponent  implements OnInit {

  @Input() events: IEvents[] = [];

  eventsDate = '';

  constructor(private readonly modalCtrl: ModalController) { }

  closeModal(){
    this.modalCtrl.dismiss();
  }

  async openDetail(item: IEvents) {
    const modal = await this.modalCtrl.create({
      component: DetailModalComponent,
      breakpoints: [0, 0.5, 0.75, 1],
      initialBreakpoint: 0.75,
      handle: false,
      cssClass: 'custom-modal',
      componentProps: {
        items: [item],
        type: 'evento'
      }
    });

    await modal.present();
  }

  ngOnInit() {

    console.log(this.events);

  if (this.events.length) {
    this.eventsDate = this.events[0].start;
  }

  }



}
