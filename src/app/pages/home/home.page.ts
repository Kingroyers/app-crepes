import { Component, OnInit } from '@angular/core';
import { Auth } from 'src/app/core/providers/auth/auth';
import { AlertService } from 'src/app/core/providers/alert/alert.service';
import { ModalController } from '@ionic/angular';
import { ProfileModalComponent } from 'src/app/shared/components/profile-modal/profile-modal.component';
import { FcmTokenService } from 'src/app/core/providers/fcm/fcm-token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  showNotificationBanner = false;

  constructor(
    private readonly authSrv: Auth,
    private readonly alertSrv: AlertService,
    private readonly modalCtrl: ModalController,
    private readonly fcmTokenSrv: FcmTokenService
  ) { }

  async ngOnInit() {
    this.checkUserProfile();
    this.checkNotificationStatus();
  }

  private async checkUserProfile() {
    // Obtenemos el usuario actual con sus datos de Firestore
    const user = await this.authSrv.getCurrentUser();
    
    if (user) {
      // Re-obtenemos los datos completos para verificar campos específicos
      // getCurrentUser ya trae name, lastName y rol, pero necesitamos doc y department
      // Vamos a usar una verificación basada en lo que ya tenemos y lo que falta
      
      // Consultamos directamente a la BD para tener la foto y el documento
      // (Podríamos optimizar esto luego en el Auth service)
      const userData = await (this.authSrv as any).crudSrv.getByUid('users', user.userUid);
      
      if (userData && userData.length > 0) {
        const fullUser = userData[0];
        
        const isIncomplete = 
          !fullUser.name || 
          !fullUser.lastName || 
          !fullUser.department || 
          !fullUser.doc;

        if (isIncomplete) {
          // Diseño personalizado de alerta profesional
          const result = await (this.alertSrv as any).Swal.fire({
            title: '¡Bienvenido!',
            text: 'Para comunicarnos mejor, por favor completa tus datos (Nombre, Apellido, Departamento y Documento).',
            icon: 'info',
            iconColor: '#aa8169',
            showCancelButton: true,
            confirmButtonText: 'Completar ahora',
            cancelButtonText: 'Más tarde',
            confirmButtonColor: '#6B4E3D',
            cancelButtonColor: '#e0d5ce',
            backdrop: `rgba(107, 78, 61, 0.4)`,
            heightAuto: false, // Fix crítico para Ionic
            allowOutsideClick: false,
            customClass: {
              popup: 'ar-alert ar-alert--premium',
              confirmButton: 'ar-confirm-btn',
              cancelButton: 'ar-cancel-btn'
            }
          });

          if (result.isConfirmed) {
            this.openProfileModal(fullUser);
          }
        }
      }
    }
  }

  private checkNotificationStatus(): void {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission === 'default') {
      this.showNotificationBanner = true;
    }
  }

  async enableNotifications(): Promise<void> {
    this.showNotificationBanner = false;
    await this.fcmTokenSrv.requestPermissionAndRegister();
  }

  dismissBanner(): void {
    this.showNotificationBanner = false;
  }

  private async openProfileModal(user: any) {
    const modal = await this.modalCtrl.create({
      component: ProfileModalComponent,
      componentProps: { 
        user: user,
        forceEdit: true 
      }
    });

    await modal.present();
    
    const { data } = await modal.onWillDismiss();
    if (data?.updated) {
      this.alertSrv.toast('¡Gracias por completar tu perfil!');
    }
  }

}
