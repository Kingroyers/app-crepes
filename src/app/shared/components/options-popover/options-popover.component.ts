import { Component } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';
import { Auth } from 'src/app/core/providers/auth/auth';

@Component({
  selector: 'app-options-popover',
  templateUrl: './options-popover.component.html',
  styleUrls: ['./options-popover.component.scss'],
  standalone: false,
})
export class OptionsPopoverComponent {

  menuItems = [
    { label: 'Inicio',   icon: 'home-outline',               route: '/home'     },
    { label: 'Eventos',  icon: 'calendar-outline',            route: '/notes'    },
    { label: 'Tareas',   icon: 'checkmark-circle-outline',    route: '/add-task' },
  ];

  constructor(
    private readonly popoverCtrl: PopoverController,
    private readonly navCtrl: NavController,
    private readonly authSrv: Auth
  ) {}

  async navigate(route: string) {
    await this.popoverCtrl.dismiss();
    this.navCtrl.navigateRoot(route);
  }

  async signOut() {
    await this.popoverCtrl.dismiss();
    this.authSrv.logOut();
  }
}
