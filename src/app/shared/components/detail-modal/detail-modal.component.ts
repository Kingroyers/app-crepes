import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Auth } from 'src/app/core/providers/auth/auth';
import { AlertService } from 'src/app/core/providers/alert/alert.service';
import { IEvents } from 'src/app/interfaces/events.interface';
import { ITask } from 'src/app/interfaces/task.interface';

@Component({
  selector: 'app-detail-modal',
  templateUrl: './detail-modal.component.html',
  styleUrls: ['./detail-modal.component.scss'],
  standalone: false
})
export class DetailModalComponent implements OnInit {
  @Input() items: (IEvents | ITask)[] = [];
  @Input() type: 'evento' | 'tarea' = 'evento';

  currentUserUid = '';

  constructor(
    private readonly modalCtrl: ModalController,
    private readonly authSrv: Auth,
    private readonly alertSrv: AlertService
  ) {}

  async ngOnInit() {
    const user = await this.authSrv.getCurrentUser();
    this.currentUserUid = user?.userUid || '';
  }

  get isSingle(): boolean { return this.items.length === 1; }
  get firstItem(): IEvents | ITask { return this.items[0]; }
  get isEvent(): boolean { return this.type === 'evento'; }

  get isOwner(): boolean {
    if (!this.isSingle || !this.currentUserUid) return false;
    const item = this.firstItem as any;
    return item.uid === this.currentUserUid;
  }

  asEvent(item: IEvents | ITask): IEvents { return item as IEvents; }
  asTask(item: IEvents | ITask): ITask { return item as ITask; }

  selectItem(item: IEvents | ITask) {
    this.items = [item];
  }

  editItem() {
    const item = this.firstItem as any;
    const docId = item.docId || item.id || '';
    this.modalCtrl.dismiss({ item: this.firstItem, docId }, 'edit');
  }

  async deleteItem() {
    const label = this.isEvent ? 'evento' : 'tarea';
    const result = await this.alertSrv.confirm(
      `¿Eliminar ${label}?`,
      `Esta acción no se puede deshacer.`
    );
    if (result.isConfirmed) {
      const item = this.firstItem as any;
      const docId = item.docId || item.id || '';
      this.modalCtrl.dismiss({ docId, type: this.type }, 'delete');
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
