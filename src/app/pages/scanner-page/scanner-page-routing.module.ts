import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScannerPagePage } from './scanner-page.page';

const routes: Routes = [
  {
    path: '',
    component: ScannerPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScannerPagePageRoutingModule {}
