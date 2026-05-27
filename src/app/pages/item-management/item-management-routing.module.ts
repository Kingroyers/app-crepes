import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemManagementPage } from './item-management.page';

const routes: Routes = [
  {
    path: '',
    component: ItemManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemManagementPageRoutingModule {}
