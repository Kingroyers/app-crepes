import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController, ModalController, PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Auth } from 'src/app/core/providers/auth/auth';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';
import { IUser } from 'src/app/interfaces/user.interface';
import { ModalComponent } from '../modal/modal.component';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';
import { ProfilePopoverComponent } from '../profile-popover/profile-popover.component';
import { NotificationsModalComponent } from '../notifications-modal/notifications-modal.component';
import { IEvents } from 'src/app/interfaces/events.interface';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent implements OnInit, OnDestroy {
  user: IUser | null = null;
  initials = '';

  isSearchOpen = false;
  searchQuery = '';
  filterDate = '';
  filterPdv = '';
  searchResults: any[] = [];
  private allEvents: IEvents[] = [];

  unreadCount = 0;
  private notifSub!: Subscription;

  constructor(
    private readonly authSrv: Auth,
    private readonly crudSrv: Crud,
    private readonly modalCtrl: ModalController,
    private readonly popoverCtrl: PopoverController,
    private readonly menuCtrl: MenuController,
    private readonly notifSrv: NotificationService
  ) {}

  async ngOnInit() {
    const currentUser = await this.authSrv.getCurrentUser();
    if (currentUser?.userUid) {
      const userData = await this.crudSrv.getByUid('users', currentUser.userUid);
      if (userData && userData.length > 0) {
        this.user = userData[0] as IUser;
        this.initials = this.buildInitials(this.user.name, this.user.lastName);
      }
    }
    const eventsData = await this.crudSrv.getAll<IEvents>('events');
    if (eventsData) this.allEvents = eventsData;

    // Suscripción en tiempo real — el badge se actualiza automáticamente
    this.notifSub = this.notifSrv.listenMyNotifications().subscribe(notifs => {
      this.unreadCount = notifs.filter(n => !n.read).length;
    });
  }

  ngOnDestroy() {
    this.notifSub?.unsubscribe();
  }

  buildInitials(name: string, lastName: string): string {
    return (name?.charAt(0) || '').toUpperCase() + (lastName?.charAt(0) || '').toUpperCase();
  }

  // ── Popover del avatar (Ver perfil / Cerrar sesión) ───────────────────
  async openAvatarMenu(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: ProfilePopoverComponent,
      componentProps: {
        initials: this.initials,
        userName: `${this.user?.name || ''} ${this.user?.lastName || ''}`.trim(),
        department: this.user?.department || '',
        photoURL: this.user?.photoURL || '',
      },
      event,
      cssClass: 'profile-popover',
      alignment: 'start',
    });
    await popover.present();

    const { data } = await popover.onWillDismiss();
    if (data?.action === 'profile') {
      this.openProfile();
    } else if (data?.action === 'logout') {
      this.authSrv.logOut();
    }
  }

  // ── Modal de perfil (ver / editar) ────────────────────────────────────
  async openProfile() {
    const modal = await this.modalCtrl.create({
      component: ProfileModalComponent,
      componentProps: { user: this.user },
      cssClass: 'profile-modal',
      breakpoints: [0, 0.75, 1],
      initialBreakpoint: 0.75,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data?.updated && data?.user) {
      this.user = data.user;
      this.initials = this.buildInitials(this.user!.name, this.user!.lastName);
    }
  }

  // ── Notificaciones ────────────────────────────────────────────────────
  async openNotifications() {
    const modal = await this.modalCtrl.create({
      component: NotificationsModalComponent,
      breakpoints: [0, 0.5, 0.85, 1],
      initialBreakpoint: 0.85,
      handle: false,
      cssClass: 'custom-modal',
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data?.unreadCount !== undefined) {
      this.unreadCount = data.unreadCount;
    }
  }

  // ── Menú hamburguesa ──────────────────────────────────────────────────
  async openMenu() {
    await this.menuCtrl.open('main-menu');
  }

  // ── Búsqueda ──────────────────────────────────────────────────────────
  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
    if (!this.isSearchOpen) {
      this.searchQuery = '';
      this.filterDate = '';
      this.filterPdv = '';
      this.searchResults = [];
    }
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.applyFilters();
  }

  onFilterDate(date: string) {
    this.filterDate = date;
    this.applyFilters();
  }

  onFilterPdv(pdv: string) {
    this.filterPdv = pdv;
    this.applyFilters();
  }

  clearFilters() {
    this.filterDate = '';
    this.filterPdv = '';
    this.applyFilters();
  }

  get hasActiveFilters(): boolean {
    return !!this.filterDate || !!this.filterPdv.trim();
  }

  get uniquePdvs(): string[] {
    return [...new Set(this.allEvents.map(e => e.pdv).filter(Boolean))].sort();
  }

  private toLocalDateStr(isoStr: string): string {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private applyFilters() {
    const hasText = !!this.searchQuery.trim();
    const hasDate = !!this.filterDate;
    const hasPdv = !!this.filterPdv.trim();

    if (!hasText && !hasDate && !hasPdv) {
      this.searchResults = [];
      return;
    }

    const q = this.searchQuery.toLowerCase().trim();
    const pdvQ = this.filterPdv.toLowerCase().trim();

    this.searchResults = this.allEvents
      .filter(e => {
        const matchesText = !hasText || (
          e.title?.toLowerCase().includes(q) ||
          e.department?.toLowerCase().includes(q) ||
          e.responsible?.toLowerCase().includes(q) ||
          e.pdv?.toLowerCase().includes(q)
        );
        const matchesDate = !hasDate ||
          this.toLocalDateStr(e.start) === this.filterDate;
        const matchesPdv = !hasPdv ||
          e.pdv?.toLowerCase().includes(pdvQ);

        return matchesText && matchesDate && matchesPdv;
      })
      .slice(0, 8);
  }

  async selectEvent(event: any) {
    this.isSearchOpen = false;
    this.searchQuery = '';
    this.searchResults = [];
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      breakpoints: [0, 0.5, 0.75],
      initialBreakpoint: 0.5,
      handle: true,
      cssClass: 'custom-modal',
      componentProps: { events: [event] },
    });
    await modal.present();
  }
}
