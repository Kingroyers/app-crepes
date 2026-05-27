import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartVisitPageRoutingModule } from './start-visit-routing.module';

import { StartVisitPage } from './start-visit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartVisitPageRoutingModule
  ],
  declarations: [StartVisitPage]
})
export class StartVisitPageModule {}
