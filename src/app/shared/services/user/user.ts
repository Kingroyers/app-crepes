import { Injectable } from '@angular/core';
import { Auth } from 'src/app/core/providers/auth/auth';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';
import { IUserCreate } from 'src/app/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class User {
  constructor(private readonly authSrv: Auth, private readonly crudSrv: Crud) { }

  async createUser(user: IUserCreate): Promise<void> {

    try {
      console.log(user);

      const uid = await this.authSrv.create(user.email, user.password);

      if (!uid) {
        throw new Error('No se pudo crear el usuario');
      }

      await this.crudSrv.register('users', {
        uid,
        doc: '',
        name: user.name,
        lastName: user.lastName,
        department: user.department,
        email: user.email,
        password: user.password,
        rol: 'user',
        state: 'active'
      }, uid)
      console.log('Funciono');

    } catch (error) {
      console.log('No funciono', error);
    }

  }
}
