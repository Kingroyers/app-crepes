import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateVisitPageRoutingModule } from './create-visit-routing.module';

import { CreateVisitPage } from './create-visit.page';
import { SharedModule } from "src/app/shared/shared-module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateVisitPageRoutingModule,
    SharedModule
],
  declarations: [CreateVisitPage]
})
export class CreateVisitPageModule {}
