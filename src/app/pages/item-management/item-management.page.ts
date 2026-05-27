import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Auth } from 'src/app/core/providers/auth/auth';
import { IEquipo, IHistorialVisita } from 'src/app/interfaces/equipos.interface';
import { SupabaseSrv } from 'src/app/shared/services/supabase/supabase-srv';

@Component({
  selector: 'app-item-management',
  templateUrl: './item-management.page.html',
  styleUrls: ['./item-management.page.scss'],
  standalone: false
})
export class ItemManagementPage implements OnInit {

  userNameResponsible!: string;
  isSubmitting = false;
  submitSuccess = false;
  submitError: string | null = null;

  /** Fecha mínima para el próximo mantenimiento (hoy) */
  todayDate: string = new Date().toISOString().split('T')[0];

  visitDate!: FormControl;
  visitType!: FormControl;
  areaRealiza!: FormControl;
  tecnicoName!: FormControl;
  observaciones!: FormControl;
  nextMaintainance!: FormControl;

  formHistorial!: FormGroup;

  data!: {
    equipo: IEquipo;
    historial: IHistorialVisita;
    userName: string;
    userDepartment: string;
    fecha: string;
  };

  equipo: IEquipo | null = null;
  historial: IHistorialVisita | null = null;

  constructor(
    private readonly router: Router,
    private readonly navCtrl: NavController,
    private readonly authSrv: Auth,
    private readonly supabaseSrv: SupabaseSrv
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.data = navigation.extras.state['data'];
    }else{
      this.navCtrl.navigateBack('/sacanner-page');
      return;
    }
  }

  async ngOnInit() {
    this.initForm();
    const user = await this.authSrv.getCurrentUser();
    if (user) {
      this.userNameResponsible = user.userName;
      // Si el control ya tiene valor (pasado por navegación), no sobreescribimos
      if (!this.tecnicoName.value) {
        this.tecnicoName.setValue(user.userName);
      }
    }
  }

  private initForm() {
    this.visitDate       = new FormControl(this.data?.fecha ?? '', [Validators.required]);
    this.visitType       = new FormControl('',                      [Validators.required]);
    this.areaRealiza     = new FormControl(this.data?.userDepartment ?? '', [Validators.required]);
    this.tecnicoName     = new FormControl(this.data?.userName ?? '',       [Validators.required]);
    this.observaciones   = new FormControl('',                      [Validators.required]);
    this.nextMaintainance = new FormControl('',                     );

    this.formHistorial = new FormGroup({
      visitDate:        this.visitDate,
      visitType:        this.visitType,
      areaRealiza:      this.areaRealiza,
      tecnicoName:      this.tecnicoName,
      observaciones:    this.observaciones,
      nextMaintainance: this.nextMaintainance,
    });
  }

  async onSubmit() {
    if (this.formHistorial.invalid) {
      this.formHistorial.markAllAsTouched();
      return;
    }

    this.isSubmitting  = true;
    this.submitSuccess = false;
    this.submitError   = null;

    try {
      const visita = {
        codigo_equipo:        this.data.equipo.codigo_barras,
        fecha_visita:         this.todayDate,
        tipo_visita:          this.visitType.value,
        area_realiza:         this.areaRealiza.value,
        tecnico_nombre:       this.tecnicoName.value,
        observaciones:        this.observaciones.value,
        proximo_mantenimiento: this.nextMaintainance.value,
      };

      await this.supabaseSrv.guardarVisita(visita);
      this.submitSuccess = true;
      this.formHistorial.reset();

      // Volvemos al scanner tras 1.5 s
      setTimeout(() => this.navCtrl.navigateBack('/sacanner-page'), 1500);

    } catch (err: any) {
      this.submitError = err?.message ?? 'Ocurrió un error al guardar la visita.';
    } finally {
      this.isSubmitting = false;
    }
  }

  // ─── TEMPORAL: Diagnóstico de campos PDF ───────────────────────────────
  // async debugPdfFields() {
  //   const archivos = [
  //     'chequeo_de_visitas_estandarizada.pdf',
  //     'Evaluacion_Pdv.pdf',
  //     'Verificacion_ordenylimpieza_almacen.pdf'
  //   ];

  //   for (const archivo of archivos) {
  //     try {
  //       console.group(`PDF: ${archivo}`);

  //       const { data } = supabase.storage.from('PdfFiles').getPublicUrl(archivo);
  //       const url = data.publicUrl;
  //       console.log('URL:', url);

  //       const pdfBytes = await fetch(url).then(res => res.arrayBuffer());
  //       const pdfDoc = await PDFDocument.load(pdfBytes);
  //       const form = pdfDoc.getForm();
  //       const campos = form.getFields();

  //       console.log(`Total de campos detectados: ${campos.length}`);
  //       console.table(
  //         campos.map(campo => ({
  //           nombre: campo.getName(),
  //           tipo: campo.constructor.name
  //         }))
  //       );

  //       console.groupEnd();
  //     } catch (err) {
  //       console.error(`Error al procesar ${archivo}:`, err);
  //       console.groupEnd();
  //     }
  //   }

  //   console.log('Diagnóstico completo de los 3 PDFs.');
  // }
}
