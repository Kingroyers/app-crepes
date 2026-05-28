import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScannerPagePageRoutingModule } from './scanner-page-routing.module';

import { ScannerPagePage } from './scanner-page.page';
import { SharedModule } from "src/app/shared/shared-module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScannerPagePageRoutingModule,
    SharedModule
],
  declarations: [ScannerPagePage]
})
export class ScannerPagePageModule {}
