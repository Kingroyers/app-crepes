import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EquipmentDetailPage } from './equipment-detail.page';

const routes: Routes = [
  {
    path: '',
    component: EquipmentDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipmentDetailPageRoutingModule {}
