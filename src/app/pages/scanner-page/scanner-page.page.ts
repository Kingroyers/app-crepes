import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BarcodeFormat } from '@zxing/library'
import { Auth } from 'src/app/core/providers/auth/auth';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';
import { IEquipo, IHistorialVisita } from 'src/app/interfaces/equipos.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { SupabaseSrv } from 'src/app/shared/services/supabase/supabase-srv';

@Component({
  selector: 'app-scanner-page',
  templateUrl: './scanner-page.page.html',
  styleUrls: ['./scanner-page.page.scss'],
  standalone: false
})
export class ScannerPagePage implements OnInit {
 buscandoEquipo = false;
  userDepartment!: string;
  responsibleUser!: string;
  currentTime: Date = new Date();


  equipoResult!: IEquipo;
  historialResult: IHistorialVisita | undefined;

  availableDevice: MediaDeviceInfo[] = [];
  currentDevice: MediaDeviceInfo | undefined;
  hasDevice: boolean = false;

   qrResultString: string = '';

  allowedFormats = [
    BarcodeFormat.QR_CODE,
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.CODE_128,
    BarcodeFormat.UPC_A
  ];


  constructor(
    private readonly navSrv: NavController,
    private readonly supabaseSrv: SupabaseSrv,
    private readonly authSrv: Auth,
    private readonly crudSrv: Crud) { }

  async onCodeResult(resultString: string) {

    if (this.buscandoEquipo) return;

     if (resultString === this.qrResultString) return;

    this.qrResultString = resultString;

    if (resultString!= '' && resultString != null) {

      this.buscandoEquipo = true;

      try{
        this.equipoResult = await this.supabaseSrv.getEquipoCompleto(resultString);

        if (this.equipoResult.historial_visitas && this.equipoResult.historial_visitas.length > 0 ) {

          this.historialResult = this.equipoResult.historial_visitas[0];

        }

      } finally{
        this.buscandoEquipo = false;
      }

    }
  }

  onCameraFound(devices: MediaDeviceInfo[]): void {

    this.availableDevice = devices;
    this.hasDevice = devices.length > 0;

    if (this.hasDevice) {

      const backendCamera = devices.find(devices =>
        devices.label.toLowerCase().includes('back') ||
        devices.label.toLowerCase().includes('trasera')
      );

      this.currentDevice = backendCamera || devices[0];
    }
  }

  onDeviceSelectChange(event: any) {
    const selectedDeviceId = event.detail.value;
    const device = this.availableDevice.find(d => d.deviceId === selectedDeviceId);
    this.currentDevice = device;
  }

  async goToItemManagment() {

      const fecha = this.currentTime.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
      const hora = this.currentTime.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    });

    this.navSrv.navigateRoot('item-management', {
      state: {
        data: {
          equipo: this.equipoResult,
          historial: this.historialResult,
          userName: this.responsibleUser,
          userDepartment: this.userDepartment,
          fecha: fecha
        }
      }
    })
  }

  goToEquipmentDetail() {
    this.navSrv.navigateForward('equipment-detail', {
      state: {
        data: {
          equipo: this.equipoResult,
          historial: this.historialResult,
          userName: this.responsibleUser,
          userDepartment: this.userDepartment,
          fecha: ''
        }
      }
    });
  }

  async ngOnInit() {


    const currentUser = await this.authSrv.getCurrentUser();

    if (currentUser) {
      const user = await this.crudSrv.getByUid('users', currentUser?.userUid);
      user ? this.userDepartment = user[0].department : null
      this.responsibleUser = currentUser?.userName
    }
  }

}
