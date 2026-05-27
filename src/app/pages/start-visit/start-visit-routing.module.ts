import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartVisitPage } from './start-visit.page';

const routes: Routes = [
  {
    path: '',
    component: StartVisitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartVisitPageRoutingModule {}
