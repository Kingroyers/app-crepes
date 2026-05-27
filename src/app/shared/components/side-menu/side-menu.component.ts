import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { Auth } from 'src/app/core/providers/auth/auth';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: false,
})
export class SideMenuComponent {
  userRole: string = '';

  constructor(
    private readonly menuCtrl: MenuController,
    private readonly navCtrl: NavController,
    private readonly authSrv: Auth
  ) {
    this.checkUserRole();
  }

  async checkUserRole() {
    const user = await this.authSrv.getCurrentUser();
    if (user) {
      this.userRole = user.rol || 'user';
      console.log('SideMenu - Rol detectado:', this.userRole);
    }
  }

  async navigate(route: string) {
    await this.menuCtrl.close('main-menu');
    this.navCtrl.navigateRoot(route);
  }

  async closeMenu() {
    await this.menuCtrl.close('main-menu');
  }

  async signOut() {
    await this.menuCtrl.close('main-menu');
    this.authSrv.logOut();
  }
}
