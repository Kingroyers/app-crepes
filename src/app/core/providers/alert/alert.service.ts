import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';

const PRIMARY = '#6B4E3D';
const CONFIRM_BTN = '#6B4E3D';
const CANCEL_BTN = '#e0d5ce';

// Fix crítico para Ionic + iOS: evita que SweetAlert2 colapse ion-content
const BASE_CONFIG = {
  heightAuto: false,
  scrollbarPadding: false,
} as const;


@Injectable({ providedIn: 'root' })
export class AlertService {
  public Swal = Swal;

  success(title: string, text?: string) {
    return Swal.fire({
      ...BASE_CONFIG,
      icon: 'success',
      title,
      text,
      confirmButtonColor: CONFIRM_BTN,
      confirmButtonText: 'Aceptar',
      customClass: { popup: 'ar-alert' },
    });
  }

  error(title: string, text?: string) {
    return Swal.fire({
      ...BASE_CONFIG,
      icon: 'error',
      title,
      text,
      confirmButtonColor: CONFIRM_BTN,
      confirmButtonText: 'Aceptar',
      customClass: { popup: 'ar-alert' },
    });
  }

  warning(title: string, text?: string) {
    return Swal.fire({
      ...BASE_CONFIG,
      icon: 'warning',
      title,
      text,
      confirmButtonColor: CONFIRM_BTN,
      confirmButtonText: 'Aceptar',
      customClass: { popup: 'ar-alert' },
    });
  }

  confirm(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      ...BASE_CONFIG,
      icon: 'question',
      title,
      text,
      showCancelButton: true,
      confirmButtonColor: CONFIRM_BTN,
      cancelButtonColor: CANCEL_BTN,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'ar-alert',
        cancelButton: 'ar-cancel-btn',
      },
    });
  }

  toast(title: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') {
    return Swal.mixin({
      ...BASE_CONFIG,
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      customClass: { popup: 'ar-toast' },
    }).fire({ icon, title });
  }

  showConflictDialog(responsibleName: string): Promise<SweetAlertResult> {
    return Swal.fire({
      ...BASE_CONFIG,
      title: 'Conflicto de horario',
      text: `Ya existe un evento en este PDV y horario. Responsable: ${responsibleName}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: CONFIRM_BTN,
      cancelButtonColor: CANCEL_BTN,
      confirmButtonText: 'Notificar Usuario',
      cancelButtonText: 'Cancelar Evento',
      reverseButtons: true,
      customClass: {
        popup: 'ar-alert',
        cancelButton: 'ar-cancel-btn',
      },
    });
  }
}
