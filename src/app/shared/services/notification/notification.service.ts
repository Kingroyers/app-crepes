import { Injectable } from '@angular/core';
import { Observable, from, switchMap, of } from 'rxjs';
import { Auth } from 'src/app/core/providers/auth/auth';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';
import { FcmTokenService } from 'src/app/core/providers/fcm/fcm-token.service';
import { INotification } from 'src/app/interfaces/notification.interface';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(
    private readonly crudSrv: Crud,
    private readonly authSrv: Auth,
    private readonly fcmTokenSrv: FcmTokenService
  ) {}

  async getMyNotifications(): Promise<INotification[]> {
    const user = await this.authSrv.getCurrentUser();
    if (!user?.userUid) return [];
    return this.crudSrv.getNotifications(user.userUid) as Promise<INotification[]>;
  }

  async markAsRead(notificationId: string): Promise<void> {
    return this.crudSrv.update('notifications', notificationId, { read: true });
  }

  async markAllAsRead(notifications: INotification[]): Promise<void> {
    const unread = notifications.filter(n => !n.read && n.id);
    await Promise.all(unread.map(n => this.markAsRead(n.id!)));
  }

  /** Escucha notificaciones en tiempo real para el usuario actual */
  listenMyNotifications(): Observable<INotification[]> {
    return from(this.authSrv.getCurrentUser()).pipe(
      switchMap(user => {
        if (!user?.userUid) return of([] as INotification[]);
        return this.crudSrv.listenNotifications(user.userUid) as Observable<INotification[]>;
      })
    );
  }

  /**
   * Registra silenciosamente el token FCM si el permiso ya fue otorgado previamente.
   * Nunca abre el diálogo de permisos. Llamar una vez por sesión tras login exitoso.
   * Si el permiso no fue concedido, la UI debe invocar
   * FcmTokenService.requestPermissionAndRegister() desde un gesto explícito del usuario.
   */
  async setupPushNotifications(): Promise<void> {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
      return;
    }
    await this.fcmTokenSrv.requestPermissionAndRegister();
  }
}
