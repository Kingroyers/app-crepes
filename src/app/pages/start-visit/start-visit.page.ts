import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth } from 'src/app/core/providers/auth/auth';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';
import { IFormat } from 'src/app/interfaces/formats.interface';
import { Categories } from 'src/app/shared/services/jsonsProviders';
import { NavController } from '@ionic/angular';
import { IGoal } from 'src/app/interfaces/goal.interface';


@Component({
  selector: 'app-start-visit',
  templateUrl: './start-visit.page.html',
  styleUrls: ['./start-visit.page.scss'],
  standalone: false
})
export class StartVisitPage implements OnInit, OnDestroy {
  firstName!: string;

  user!: {userUid: string; userName: string; rol: string};

  formatsArray: IFormat[] = [];

  finalFormats: IFormat[] = [];

  doc!: string;
  visitLength!: number;
  goalLength!: number;
  department!: string;

  greeting: 'Buenos días' | 'Buenas tardes' | 'Buenas noches' = 'Buenos días';

  currentTime: Date = new Date();
  private timerInterval: any;


  constructor(
    private readonly navSrv: NavController,
    private readonly authSrv: Auth,
    private readonly crudSrv: Crud,
    private readonly jsonPrv: Categories
  ) {
  }

  async ngOnInit() {

    this.setGreetin();

    const user = await this.authSrv.getCurrentUser();

   user != undefined ? this.user = user: console.log('No user');


    user != undefined ? this.firstName = user?.userName.split(' ')[0] : console.log('Sin usuario');

    if (user?.userUid) {
      const savedUser = await this.crudSrv.getByUid('users', user.userUid)

      if (savedUser) {
        const month = new Date().toISOString().slice(0, 7);
        this.department = savedUser[0].department;
        this.doc = savedUser[0].doc;



       const visitsLengt = await this.crudSrv.getVisitsByDocAndMonth('visits', this.doc, month);
       const savedGoal: IGoal[] = await this.crudSrv.getGoalByDocAndMonth('goals', this.doc, month);

       if (savedGoal.length > 0 ) {
          this.goalLength = savedGoal[0].monthlyGoal;
       }else{
        this.goalLength = 0;
       }


       this.visitLength = visitsLengt.length;

      }
    }

    this.jsonPrv.getFormats().subscribe(formats => {
      this.formatsArray = formats

      this.finalFormats =  this.formatsArray.filter(format => format.department.trim().toLowerCase() == this.department.trim().toLowerCase());
      console.log(this.finalFormats);

    })



    this.timerInterval = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  goBack() {
    this.navSrv.navigateBack('/home');
  }

  goToCreateVisit(pdfName: string, title:string){
    const fecha = this.currentTime.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const hora = this.currentTime.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    });

     this.navSrv.navigateRoot('create-visit', {
     state: { data:{
      pdfName: pdfName,
      responsible: this.user.userName,
      madeTime: `${fecha}, ${hora}`,
      title: title,
      doc: this.doc
     }}
    });
  }

  setGreetin() {
    const horaActual = this.currentTime.getHours();

    if (horaActual >= 12 && horaActual < 19) {

      this.greeting = 'Buenas tardes';
    } else if (horaActual >= 19 || horaActual < 5) {

      this.greeting = 'Buenas noches';
    } else {

      this.greeting = 'Buenos días';
    }
  }




// visitasTotales: number = 30;

// Este "getter" calcula el porcentaje automáticamente
get porcentajeMeta(): number {
  if (this.goalLength === 0) return 0;

  if (this.visitLength === undefined) {
    return 0;
  }


  return Math.round((this.visitLength / this.goalLength) * 100);
}
get dashArrayDinamico(): string {

  return `${this.porcentajeMeta}, 100`;
}


}
