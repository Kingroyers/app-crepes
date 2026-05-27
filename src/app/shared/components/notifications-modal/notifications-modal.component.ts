import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { INotification } from 'src/app/interfaces/notification.interface';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-notifications-modal',
  templateUrl: './notifications-modal.component.html',
  styleUrls: ['./notifications-modal.component.scss'],
  standalone: false,
})
export class NotificationsModalComponent implements OnInit, OnDestroy {
  notifications: INotification[] = [];
  isLoading = true;
  private notifSub!: Subscription;

  constructor(
    private readonly modalCtrl: ModalController,
    private readonly notifSrv: NotificationService,
    private readonly navSrv: NavController,
  ) {}

  async ngOnInit() {
    this.isLoading = true;
    // Suscripción en tiempo real: notificaciones nuevas aparecen sin recargar
    this.notifSub = this.notifSrv.listenMyNotifications().subscribe(notifs => {
      this.notifications = notifs;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.notifSub?.unsubscribe();
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  async onNotifTap(notif: INotification) {
    if (!notif.id) return;
    await this.notifSrv.markAsRead(notif.id);
    notif.read = true;
    if (notif.type == 'ev') {
      await this.modalCtrl.dismiss({ unreadCount: this.unreadCount });
      this.navSrv.navigateRoot('notify-details', {
        state: { data: notif }
      });
    }

  }

  async markAllAsRead() {
    await this.notifSrv.markAllAsRead(this.notifications);
    this.notifications.forEach(n => (n.read = true));
  }

  closeModal() {
    this.modalCtrl.dismiss({ unreadCount: this.unreadCount });
  }
}
