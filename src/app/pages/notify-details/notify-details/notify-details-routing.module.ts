import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotifyDetailsPage } from './notify-details.page';

const routes: Routes = [
  {
    path: '',
    component: NotifyDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotifyDetailsPageRoutingModule {}
