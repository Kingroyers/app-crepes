import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PDFDocument } from 'pdf-lib';
import { FORMATOS_VISITA } from 'src/app/core/models/formatos.data';
import { supabase } from 'src/app/database/supabase';
import { IVisit } from 'src/app/interfaces/visit.interface';
import { Visit } from 'src/app/shared/services/visit/visit';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-create-visit',
  templateUrl: './create-visit.page.html',
  styleUrls: ['./create-visit.page.scss'],
  standalone: false
})
export class CreateVisitPage implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  submitError: string | null = null;
  submitSuccess = false;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  };



  responsible!: FormControl;
  pdv!: FormControl;
  usedPdf!: FormControl;
  madeAt!: FormControl;
  doc!: FormControl;
  month!: FormControl;
  formVisit!: FormGroup;


  monthToSave!: string;
  pdfName: string = '';
  title: string = '';

  data!: { madeTime: string, pdfName: string, responsible:string, title: string, doc: string}


  dinamicForm!: FormGroup;
  itemsEvaluacion: any[] = [];
  pdfBytesOriginal!: ArrayBuffer;
  cargando: boolean = false;

  formatoActivo: any;


  constructor(private readonly navSrv: NavController,  private readonly router: Router, private readonly visitSrv: Visit ) {

    this.monthToSave = new Date().toISOString().slice(0, 7);

    const navigation = this.router.getCurrentNavigation();

    if(navigation?.extras?.state){
      this.data = navigation.extras.state['data'];

      this.pdfName = this.data.pdfName;
      this.title = this.data.title;
    }else{
      this.navSrv.navigateBack('/start-visit');
      return;
    }
    this.dinamicForm = new FormGroup({});
  };

 async ngOnInit() {

    this.initForm();

   await this.startVisitProcces(this.pdfName);
  };

  async startVisitProcces(formatoKey: string) {
    this.cargando = true;

    try {

      this.formatoActivo = FORMATOS_VISITA[formatoKey];

      if (!this.formatoActivo) {
        throw new Error('El formato seleccionado no existe en la configuración.');
      }

      const { data } = supabase.storage.from('PdfFiles').getPublicUrl(this.formatoActivo.nombreArchivoPdf);

      const urlPdf = data.publicUrl;

      await this.loadStructurePDF(urlPdf);

    } catch (error) {
      console.error('Error al procesar la visita:', error);
    } finally {
      this.cargando = false;
    }
  };

  get tipoRespuesta(): string {
    return this.formatoActivo?.tipoRespuesta ?? 'cumple';
  }

  async loadStructurePDF(url: string) {
    this.pdfBytesOriginal = await fetch(url).then(res => res.arrayBuffer());

    const totalItems = this.formatoActivo.totalItems;
    const diccionario = this.formatoActivo.diccionario;
    const tipo = this.tipoRespuesta;

    this.itemsEvaluacion = [];

    if (tipo === 'scale_1_5') {
      for (let i = 1; i <= totalItems; i++) {
        const nombrePunto = `pnto_item${i}`;
        this.dinamicForm.addControl(nombrePunto, new FormControl(''));
        this.itemsEvaluacion.push({
          id: i,
          descripcion: diccionario[i] || `Descripción pendiente para el ítem ${i}`,
          tipo: 'dropdown',
          control: nombrePunto
        });
      }
      this.dinamicForm.addControl('observa_eva', new FormControl(''));

    } else if (tipo === 'si_no_na') {
      for (let i = 1; i <= totalItems; i++) {
        const ctrlSi  = `satis_si_check${i}`;
        const ctrlNo  = `satis_no_check${i}`;
        const ctrlNa  = `satis_na_check${i}`;
        const ctrlObs = `observa_${i}`;

        const controlSi  = new FormControl(false);
        const controlNo  = new FormControl(false);
        const controlNa  = new FormControl(false);

        this.dinamicForm.addControl(ctrlSi,  controlSi);
        this.dinamicForm.addControl(ctrlNo,  controlNo);
        this.dinamicForm.addControl(ctrlNa,  controlNa);
        this.dinamicForm.addControl(ctrlObs, new FormControl(''));

        controlSi.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe(v => { if (v) { controlNo.setValue(false, { emitEvent: false }); controlNa.setValue(false, { emitEvent: false }); } });
        controlNo.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe(v => { if (v) { controlSi.setValue(false, { emitEvent: false }); controlNa.setValue(false, { emitEvent: false }); } });
        controlNa.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe(v => { if (v) { controlSi.setValue(false, { emitEvent: false }); controlNo.setValue(false, { emitEvent: false }); } });

        this.itemsEvaluacion.push({
          id: i,
          descripcion: diccionario[i] || `Descripción pendiente para el ítem ${i}`,
          tipo: 'si_no_na',
          controlSi:  ctrlSi,
          controlNo:  ctrlNo,
          controlNa:  ctrlNa,
          controlObs: ctrlObs
        });
      }
      this.dinamicForm.addControl('comentarios', new FormControl(''));

    } else {
      // cumple / no_cumple (chequeo_estandarizado)
      for (let i = 1; i <= totalItems; i++) {
        const nombreCumple    = `item_cumple_${i}`;
        const nombreNoCumple  = `item_no_cumple_${i}`;

        const controlCumple   = new FormControl(false);
        const controlNoCumple = new FormControl(false);

        this.dinamicForm.addControl(nombreCumple,   controlCumple);
        this.dinamicForm.addControl(nombreNoCumple, controlNoCumple);

        controlCumple.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(marcado => {
          if (marcado) controlNoCumple.setValue(false, { emitEvent: false });
        });
        controlNoCumple.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(marcado => {
          if (marcado) controlCumple.setValue(false, { emitEvent: false });
        });

        this.itemsEvaluacion.push({
          id: i,
          descripcion: diccionario[i] || `Descripción pendiente para el ítem ${i}`,
          tipo: 'cumple',
          controlCumple:   nombreCumple,
          controlNoCumple: nombreNoCumple
        });
      }
      this.dinamicForm.addControl('observaciones', new FormControl(''));
    }

  };

  async generarPDF() {
    this.cargando = true;
    this.submitError = null;
    this.submitSuccess = false;

    try {

      const pdfDoc = await PDFDocument.load(this.pdfBytesOriginal);
      const form = pdfDoc.getForm();

      const respuestas = this.dinamicForm.value;
      const totalItems = this.formatoActivo.totalItems;
      const tipo = this.tipoRespuesta;

      const camposEnPdf = form.getFields().map(f => f.getName());

      if (tipo === 'scale_1_5') {
        // Dropdowns 1-5
        for (let i = 1; i <= totalItems; i++) {
          const nombrePunto = `pnto_item${i}`;
          try {
            const valor = respuestas[nombrePunto];
            if (valor) form.getDropdown(nombrePunto).select(valor.toString());
          } catch (e) {
            console.warn(`Campo ${nombrePunto} no encontrado en el PDF.`);
          }
        }
        try {
          const obsEva = this.dinamicForm.get('observa_eva')?.value || '';
          if (camposEnPdf.includes('observa_eva') && obsEva) form.getTextField('observa_eva').setText(obsEva);
        } catch (e) {
          console.warn('Error al llenar observa_eva:', e);
        }

      } else if (tipo === 'si_no_na') {
        // SI / NO / N/A checkboxes
        let countSi = 0, countNo = 0, countNa = 0;
        for (let i = 1; i <= totalItems; i++) {
          try {
            if (respuestas[`satis_si_check${i}`]) { form.getCheckBox(`satis_si_check${i}`).check(); countSi++; }
          } catch (e) { console.warn(`satis_si_check${i} no encontrado`); }
          try {
            if (respuestas[`satis_no_check${i}`]) { form.getCheckBox(`satis_no_check${i}`).check(); countNo++; }
          } catch (e) { console.warn(`satis_no_check${i} no encontrado`); }
          try {
            if (respuestas[`satis_na_check${i}`]) { form.getCheckBox(`satis_na_check${i}`).check(); countNa++; }
          } catch (e) { console.warn(`satis_na_check${i} no encontrado`); }
          try {
            const obs = respuestas[`observa_${i}`];
            if (obs && camposEnPdf.includes(`observa_${i}`)) form.getTextField(`observa_${i}`).setText(obs);
          } catch (e) { /* campo opcional */ }
        }
        try {
          const calificados = countSi + countNo + countNa;
          if (camposEnPdf.includes('tot_aspectos_calificados')) form.getTextField('tot_aspectos_calificados').setText(calificados.toString());
          if (camposEnPdf.includes('satisfactorio'))   form.getTextField('satisfactorio').setText(countSi.toString());
          if (camposEnPdf.includes('no_satisfactorio')) form.getTextField('no_satisfactorio').setText(countNo.toString());
          if (camposEnPdf.includes('no_aplica'))       form.getTextField('no_aplica').setText(countNa.toString());
          const comentarios = this.dinamicForm.get('comentarios')?.value || '';
          if (camposEnPdf.includes('comentarios') && comentarios) form.getTextField('comentarios').setText(comentarios);
        } catch (e) {
          console.warn('Error al llenar totales si_no_na:', e);
        }

      } else {
        // cumple / no_cumple (chequeo_estandarizado)
        let puntajeCumple = 0;
        for (let i = 1; i <= totalItems; i++) {
          const nombreCumple   = `item_cumple_${i}`;
          const nombreNoCumple = `item_no_cumple_${i}`;
          try {
            if (respuestas[nombreCumple] === true) { form.getCheckBox(nombreCumple).check(); puntajeCumple++; }
            if (respuestas[nombreNoCumple] === true) { form.getCheckBox(nombreNoCumple).check(); }
          } catch (e) {
            console.warn(`Aviso: El campo ${nombreCumple} o ${nombreNoCumple} no existe en este formato PDF.`);
          }
        }
        try {
          const porcentaje = (puntajeCumple / totalItems) * 100;
          if (camposEnPdf.includes('total_cumplimiento_num')) form.getTextField('total_cumplimiento_num').setText(puntajeCumple.toString());
          if (camposEnPdf.includes('total_cumplimiento_percent')) form.getTextField('total_cumplimiento_percent').setText(`${porcentaje.toFixed(2)} %`);
          const obsValue = this.dinamicForm.get('observaciones')?.value || '';
          if (camposEnPdf.includes('observaciones') && obsValue) form.getTextField('observaciones').setText(obsValue);
        } catch (e) {
          console.warn('Error al llenar campos de totales:', e);
        }
      }

      const todosLosCampos = form.getFields();
      todosLosCampos.forEach(campo => {
        campo.enableReadOnly();
      });

      const pdfBytesLleno = await pdfDoc.save();

      const nombreArchivoFinal = `Visita_Auditoria_${new Date().getTime()}.pdf`;
      this.descargarEnNavegador(pdfBytesLleno, nombreArchivoFinal);

      //? Solo descargamos si el pdf se genera correctamente
      const datosDeLaVisita: IVisit = this.formVisit.getRawValue();
      await this.visitSrv.createVisit(datosDeLaVisita)

      this.submitSuccess = true;

    } catch (error: any) {

      this.submitError = error?.message??
      'Ocurrio un error al generar el PDF.';
      console.error(error);
    } finally {
      this.cargando = false;
    }
  };

  descargarEnNavegador(pdfBytes: Uint8Array, nombreArchivo: string) {

    const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });


    const url = window.URL.createObjectURL(blob);


    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  public goBack(){
    this.navSrv.navigateBack('/start-visit');
  }


  private initForm(){
    this.responsible = new FormControl(this.data.responsible, [Validators.required]);
    this.pdv = new FormControl('', [Validators.required]);
    this.usedPdf = new FormControl(this.data.pdfName, [Validators.required]);
    this.madeAt =  new FormControl(this.data.madeTime, [Validators.required]);
    this.doc = new FormControl(this.data.doc, [Validators.required]);
    this.month = new FormControl(this.monthToSave, [Validators.required]);

    this.formVisit = new FormGroup({
      responsible: this.responsible,
      pdv: this.pdv,
      usedPdf: this.usedPdf,
      madeAt: this.madeAt,
      doc: this.doc,
      month: this.month
    });
  };


};
