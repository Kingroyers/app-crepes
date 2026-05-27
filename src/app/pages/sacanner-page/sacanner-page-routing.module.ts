import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SacannerPagePage } from './sacanner-page.page';

const routes: Routes = [
  {
    path: '',
    component: SacannerPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SacannerPagePageRoutingModule {}
