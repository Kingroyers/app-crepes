import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-profile-popover',
  templateUrl: './profile-popover.component.html',
  styleUrls: ['./profile-popover.component.scss'],
  standalone: false,
})
export class ProfilePopoverComponent {
  @Input() initials = '';
  @Input() userName = '';
  @Input() department = '';
  @Input() photoURL = '';

  constructor(private readonly popoverCtrl: PopoverController) {}

  viewProfile() {
    this.popoverCtrl.dismiss({ action: 'profile' });
  }

  signOut() {
    this.popoverCtrl.dismiss({ action: 'logout' });
  }
}
