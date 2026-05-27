import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

import { RoleGuard } from './core/guards/role.guard';
import { originGuard } from './core/guards/origin-guard';

const redirectToLogin = () => redirectUnauthorizedTo(['/login']);
const redirectToHome = () => redirectLoggedInTo(['/home']);

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    ...canActivate(redirectToLogin) 
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule),
    ...canActivate(redirectToHome) 
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    ...canActivate(redirectToHome) 
  },
  {
    path: 'notes',
    loadChildren: () => import('./pages/notes/notes.module').then( m => m.NotesPageModule),
    ...canActivate(redirectToLogin)
  },
  {
    path: 'add-task',
    loadChildren: () => import('./pages/add-task/add-task.module').then( m => m.AddTaskPageModule),
    ...canActivate(redirectToLogin)
  },
  {
    path: 'notify-details',
    loadChildren: () => import('./pages/notify-details/notify-details/notify-details.module').then( m => m.NotifyDetailsPageModule)
  },
  {
    path: 'pdv',
    loadChildren: () => import('./pages/pdv/pdv.module').then( m => m.PdvPageModule)
  },
  {
    path: 'create-visit',
    loadChildren: () => import('./pages/create-visit/create-visit.module').then( m => m.CreateVisitPageModule),
    canActivate: [RoleGuard, originGuard],
    data: { roles: ['admin', 'super-admin', 'jefe'] }
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then( m => m.AdminPageModule),
    canActivate: [RoleGuard],
    data: { roles: ['super-admin', 'jefe'] }
  },
  {
    path: 'manage-user',
    loadChildren: () => import('./pages/manage-user/manage-user.module').then( m => m.ManageUserPageModule),
    canActivate: [RoleGuard],
    data: { roles: ['super-admin'] }
  },
  {
    path: 'start-visit',
    loadChildren: () => import('./pages/start-visit/start-visit.module').then( m => m.StartVisitPageModule),
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'super-admin', 'jefe'] }
  },
  {
    path: 'sacanner-page',
    loadChildren: () => import('./pages/sacanner-page/sacanner-page.module').then( m => m.SacannerPagePageModule)
  },
  {
    path: 'item-management',
    loadChildren: () => import('./pages/item-management/item-management.module').then( m => m.ItemManagementPageModule)
  },
  {
    path: 'equipment-detail',
    loadChildren: () => import('./pages/equipment-detail/equipment-detail.module').then( m => m.EquipmentDetailPageModule)
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
