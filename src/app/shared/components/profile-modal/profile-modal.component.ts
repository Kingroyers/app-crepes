import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/core/providers/alert/alert.service';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';
import { IUser } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss'],
  standalone: false,
})
export class ProfileModalComponent implements OnInit {
  @Input() user: IUser | null = null;
  @Input() forceEdit = false;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  isEditing = false;
  isSaving = false;
  initials = '';
  previewPhoto: string | null = null;

  editForm = {
    doc: '',
    name: '',
    lastName: '',
    department: '',
  };

  constructor(
    private readonly modalCtrl: ModalController,
    private readonly crudSrv: Crud,
    private readonly alertSrv: AlertService
  ) {}

  ngOnInit() {
    if (this.user) {
      this.initials = this.getInitials(this.user.name, this.user.lastName);
      this.editForm = {
        doc: this.user.doc || '',
        name: this.user.name || '',
        lastName: this.user.lastName || '',
        department: this.user.department || '',
      };
      
      if (this.forceEdit) {
        this.isEditing = true;
      }
    }
  }

  getInitials(name: string, lastName: string): string {
    return (name?.charAt(0) || '').toUpperCase() + (lastName?.charAt(0) || '').toUpperCase();
  }

  dismiss(data?: any) {
    this.modalCtrl.dismiss(data);
  }

  toggleEdit() {
    this.isEditing = true;
    this.editForm = {
      doc: this.user?.doc || '',
      name: this.user?.name || '',
      lastName: this.user?.lastName || '',
      department: this.user?.department || '',
    };
  }

  cancelEdit() {
    this.isEditing = false;
    this.previewPhoto = null;
  }

  pickImage() {
    this.fileInput?.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      this.previewPhoto = await this.resizeImage(base64, 300);
    };
    reader.readAsDataURL(file);
  }

  resizeImage(base64: string, maxSize: number): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = Math.min(img.width, img.height, maxSize);
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = base64;
    });
  }

  async saveProfile() {
    if (!this.user?.uid) return;
    this.isSaving = true;
    try {
      const updated: Partial<IUser> = {
        doc: this.editForm.doc.trim(),
        name: this.editForm.name.trim(),
        lastName: this.editForm.lastName.trim(),
        department: this.editForm.department.trim(),
      };
      if (this.previewPhoto) {
        updated.photoURL = this.previewPhoto;
      }
      await this.crudSrv.update('users', this.user.uid, updated);
      this.user = { ...this.user, ...updated };
      this.initials = this.getInitials(this.user.name, this.user.lastName);
      this.isEditing = false;
      this.previewPhoto = null;
      this.alertSrv.toast('Perfil actualizado correctamente');
      this.dismiss({ updated: true, user: this.user });
    } catch (err) {
      this.alertSrv.error('Error', 'No se pudo guardar el perfil. Inténtalo de nuevo.');
    } finally {
      this.isSaving = false;
    }
  }

}
