import { Injectable, inject } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Crud } from '../crudFirebase/crud';
import { Auth } from '../auth/auth';

@Injectable({ providedIn: 'root' })
export class FcmTokenService {
  private messaging = inject(Messaging);
  private crudSrv = inject(Crud);
  private authSrv = inject(Auth);

  foregroundMessage$ = new BehaviorSubject<any>(null);

  constructor() {
    this.listenForegroundMessages();
  }

  /**
   * Pide permiso al usuario y registra el token FCM en Firestore.
   * LLAMAR SOLO desde un gesto del usuario (click en botón), nunca automático.
   */
  async requestPermissionAndRegister(): Promise<boolean> {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('[FCM] Permiso denegado por el usuario');
        return false;
      }

      const swRegistration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js'
      );

      const token = await getToken(this.messaging, {
        vapidKey: environment.FCM.vapidKey,
        serviceWorkerRegistration: swRegistration,
      });

      if (!token) {
        console.warn('[FCM] No se pudo obtener token');
        return false;
      }

      await this.saveToken(token);
      return true;
    } catch (error) {
      console.error('[FCM] Error registrando notificaciones:', error);
      return false;
    }
  }

  private async saveToken(token: string): Promise<void> {
    const currentUser = await this.authSrv.getCurrentUser();
    if (!currentUser?.userUid) return;

    await this.crudSrv.update('users', currentUser.userUid, {
      fcmToken: token,
      fcmTokenUpdatedAt: new Date().toISOString(),
      fcmPlatform: this.detectPlatform(),
    });
  }

  private listenForegroundMessages(): void {
    onMessage(this.messaging, (payload) => {
      this.foregroundMessage$.next(payload);
    });
  }

  private detectPlatform(): string {
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(ua)) return 'ios';
    if (/Android/.test(ua)) return 'android';
    return 'web';
  }
}
