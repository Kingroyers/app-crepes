import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemManagementPageRoutingModule } from './item-management-routing.module';

import { ItemManagementPage } from './item-management.page';
import { SharedModule } from "src/app/shared/shared-module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemManagementPageRoutingModule,
    SharedModule
],
  declarations: [ItemManagementPage]
})
export class ItemManagementPageModule {}
