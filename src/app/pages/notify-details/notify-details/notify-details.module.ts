import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotifyDetailsPageRoutingModule } from './notify-details-routing.module';

import { NotifyDetailsPage } from './notify-details.page';
import { SharedModule } from "src/app/shared/shared-module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotifyDetailsPageRoutingModule,
    SharedModule
],
  declarations: [NotifyDetailsPage]
})
export class NotifyDetailsPageModule {}
