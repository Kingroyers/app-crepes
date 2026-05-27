import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';
import { IPuntoDeVenta } from 'src/app/interfaces/pdv.interface';
import { CreateEventModalComponent } from '../../shared/components/create-event-modal/create-event-modal.component';


@Component({
  selector: 'app-pdv',
  templateUrl: './pdv.page.html',
  styleUrls: ['./pdv.page.scss'],
  standalone: false
})
export class PdvPage implements OnInit {

  pdvs: IPuntoDeVenta[] = [];
  estatus: string = 'Abierto'

  constructor(private readonly crudSrv: Crud, private readonly modalCtrl: ModalController) { }

 async ngOnInit() {
 const pdv= await this.crudSrv.getAll<IPuntoDeVenta>('places');
 console.log(pdv);
if (pdv) {
  this.pdvs = pdv;
}
  }

 async goTo(){

    const modal = await this.modalCtrl.create({
      component: CreateEventModalComponent,
      cssClass: 'custom-create-modal',
    });

    await modal.present();

}
}
