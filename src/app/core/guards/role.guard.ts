import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Auth } from '../providers/auth/auth';
import { Crud } from '../providers/crudFirebase/crud';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authSrv: Auth,
    private crudSrv: Crud,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const expectedRoles = route.data['roles'] as Array<string>;
    console.log('RoleGuard - Iniciando canActivate para:', state.url);
    const userFirebase = await this.authSrv.getCurrentUser();
    console.log('RoleGuard - Resultado final getCurrentUser:', userFirebase);

    if (!userFirebase) {
      console.warn('RoleGuard - No hay usuario (redirigiendo a login)');
      this.router.navigate(['/login']);
      return false;
    }

    console.log('RoleGuard - UID para buscar en DB:', userFirebase.userUid);

    try {
      const userData = await this.crudSrv.getByUid('users', userFirebase.userUid);
      
      if (userData && Array.isArray(userData) && userData.length > 0) {
        const user = userData[0];
        const userRole = (user.rol as unknown as string) || '';
        const userState = user.state || 'active'; // Usar 'state' en lugar de 'active'

        console.log('RoleGuard - User Role:', userRole);
        console.log('RoleGuard - Expected Roles:', expectedRoles);
        console.log('RoleGuard - User State:', userState);
        
        if (userState === 'active' && expectedRoles.includes(userRole)) {
          return true;
        }
      }

      console.warn('RoleGuard - Acceso denegado o usuario no encontrado');
      this.router.navigate(['/home']);
      return false;
      
    } catch (error) {
      console.error('Error en RoleGuard:', error);
      this.router.navigate(['/home']);
      return false;
    }
  }
}
