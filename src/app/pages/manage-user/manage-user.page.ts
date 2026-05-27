import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/core/providers/alert/alert.service';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';
import { IUser, IUserCreate } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.page.html',
  styleUrls: ['./manage-user.page.scss'],
  standalone: false
})
export class ManageUserPage implements OnInit {

  savedUser!: IUser;

  doc: string  = '';

  constructor(private readonly crudSrv: Crud,
      private readonly alertSrv: AlertService) { }

  ngOnInit() {

  }

  async serchByDoc(doc:string){

    try {
      if (doc.length > 4) {
        const u = await this.crudSrv.getByDoc('users', doc);

        u.length > 0 ? this.savedUser = u[0] : console.log('error al recuperar usuario');
        console.log(u);
      }

    } catch (error) {
      console.log(error);

    }


  }

  async deleteUser() {
    const uid = this.savedUser.uid;
    await this.crudSrv.delete('users', uid)
  }

 async promoteUser(rol: string | undefined) {
  try {
    const uid = this.savedUser.uid;
    if (rol === 'admin') {
      const data: Partial<IUser>  = {
        rol: 'user'
      }
     await this.crudSrv.update('users', uid, data);
     this.savedUser.rol = 'user';
      await this.alertSrv.success('Nuevo rol: user', 'success')
    }else if(rol === 'user'){
      const data: Partial<IUser>  = {
        rol: 'admin'
      }
     await this.crudSrv.update('users', uid, data);
     this.savedUser.rol = 'admin';
     await this.alertSrv.success('Nuevo rol: Admin', 'success')
    }
  } catch (error) {
    console.log(error);

  }
  }

  disableUser(uid: string) {
    console.log('Ejecutando lógica para inhabilitar al usuario con UID:', uid);
  }

}
