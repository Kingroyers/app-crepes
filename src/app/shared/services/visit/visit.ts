import { Injectable } from '@angular/core';
import { Auth } from 'src/app/core/providers/auth/auth';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';
import { IVisit } from 'src/app/interfaces/visit.interface';

@Injectable({
  providedIn: 'root',
})
export class Visit {

  constructor(private readonly authSrv: Auth, private readonly crudSrv: Crud){}


  async createVisit(visit: IVisit){

    try {
      await this.crudSrv.add('visits', visit);
      console.log('Save visit works');
    } catch (error) {
      console.log(error);

    }


  }
}
