import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateVisitPage } from './create-visit.page';

const routes: Routes = [
  {
    path: '',
    component: CreateVisitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateVisitPageRoutingModule {}
