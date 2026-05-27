import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/core/providers/alert/alert.service';
import { Auth } from 'src/app/core/providers/auth/auth';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';
import { IUser } from 'src/app/interfaces/user.interface';
import { Event } from 'src/app/shared/services/event/event';
import { User } from 'src/app/shared/services/user/user';

interface TeamMember {
  name: string;
  doc: string;
  visits: number;
  goal: number;
  tasks: number;
  active: boolean;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: false
})
export class AdminPage implements OnInit {

  savedUser!: IUser;
  currentUserName!: string;
  doc: string  = '';
  uidTo!: string;
  minDate!: string;
  firstName: string = '';

  // ── Asignar Metas ──────────────────────────────────────────────────────────
  users: IUser[] = [];
  selectedUserDoc: string = '';
  goalValue: number | null = null;
  selectedMonth: string = new Date().toISOString().slice(0, 7);

  // ── Delegar Tareas ──────────────────────────────────────────────────────
  taskName: string = '';
  taskDescription: string = '';
  taskLink: string = '';
  taskImportant: 'si' | 'no' = 'no';
  taskResponsible: string = '';
  taskDueDate: string = '';

  // ── Resumen de Equipo ──────────────────────────────────────────────────────
  teamSummary: TeamMember[] = [];

  constructor(
    private readonly authSrv: Auth,
    private readonly crudSrv: Crud,
    private readonly alertSrv: AlertService,
    private readonly sendNotiSrv: Event
  ) {}

  async ngOnInit() {

    const now = new Date().toISOString()
    const nowCol = formatDate(now, "yyyy-MM-ddTHH:mm:ss", 'es-CO', '-0500');
    this.minDate = nowCol;
    this.taskDueDate = nowCol; // valor inicial = hoy

    const currentUser = await this.authSrv.getCurrentUser();
    if (currentUser?.userName) {
      this.currentUserName = currentUser.userName;
      this.firstName = currentUser.userName.split(' ')[0];
    }

    // await this.loadUsers();
  }

  // async loadUsers() {
  //   const result = await this.crudSrv.getAll<IUser>('users');
  //   if (result) {
  //     this.users = result as IUser[];
  //     await this.buildTeamSummary();
  //   }
  // }


    async serchByDoc(doc:string){

    try {
      if (doc.length > 4) {
        const u = await this.crudSrv.getByDoc('users', doc);

        u.length > 0 ? this.savedUser = u[0] : console.log('error al recuperar usuario');
        this.users.push(this.savedUser)
        this.selectedUserDoc = this.savedUser.doc;
        this.uidTo = this.savedUser.uid;
        this.taskResponsible = `${this.savedUser.name} ${this.savedUser.lastName}`;

      }

      
    } catch (error) {
      console.log(error);

    }


  }


  // async buildTeamSummary() {
  //   const month = this.selectedMonth;
  //   const summaries: TeamMember[] = [];

  //   for (const user of this.users) {
  //     if (!user.doc) continue;

  //     const visits = await this.crudSrv.getVisitsByDocAndMonth('visits', user.doc, month);
  //     const goals  = await this.crudSrv.getGoalByDocAndMonth('goals', user.doc, month);

  //     summaries.push({
  //       name:   `${user.name} ${user.lastName}`,
  //       doc:    user.doc,
  //       visits: visits.length,
  //       goal:   goals.length > 0 ? (goals[0] as any).monthlyGoal : 0,
  //       tasks:  0,
  //       active: user.active ?? false,
  //     });
  //   }

  //   this.teamSummary = summaries;
  // }

  // ─── Asignar Meta ──────────────────────────────────────────────────────────
  async asignarMeta() {
    if (!this.selectedUserDoc || !this.goalValue || !this.selectedMonth) return;

    const existing = await this.crudSrv.getGoalByDocAndMonth('goals', this.selectedUserDoc, this.selectedMonth);

    if (existing.length > 0) {
      // Ya existe — actualizar
      const docId = (existing[0] as any).id;
      await this.crudSrv.update('goals', docId, { monthlyGoal: this.goalValue });
      await this.sendNotiSrv.sendMessage(this.uidTo, `${this.currentUserName} Ha fijado una meta de visitas`);
      this.alertSrv.toast('Meta de visitas asignada', 'success');
      
    } else {
      // No existe — crear
      await this.crudSrv.add('goals', {
        doc: this.selectedUserDoc,
        monthlyGoal: this.goalValue,
        month: this.selectedMonth
      });
       await this.sendNotiSrv.sendMessage(this.uidTo, `${this.currentUserName} Ha fijado una nueva meta de visitas`);
      this.alertSrv.toast('Meta de visitas actualizada', 'success');
    }

    // Refrescar resumen
    // await this.buildTeamSummary();

    // Limpiar formulario
    this.selectedUserDoc = '';
    this.goalValue = null;
  }

  // ─── Crear Tarea ──────────────────────────────────────────────────────
  async asignarTarea() {
    if (!this.taskName || !this.taskDueDate || !this.savedUser) return;

    try {
      await this.crudSrv.add('tasks', {
        title:       this.taskName,
        description: this.taskDescription,
        link:        this.taskLink,
        important:   this.taskImportant,
        ownerName:   `${this.savedUser.name} ${this.savedUser.lastName}`,
        uid:         this.savedUser.uid,
        limitDate:   this.taskDueDate,
      });
      this.taskName = '';
      this.taskDescription = '';
      this.taskLink = '';
      this.taskImportant = 'no';
      this.taskResponsible = '';
      this.taskDueDate = this.minDate;

      await this.sendNotiSrv.sendMessage(this.uidTo, `${this.currentUserName} Te ha asignado una nueva tarea`);

     this.alertSrv.toast('Tarea asignada', 'success');
      
      
    } catch (error) {
      console.log(error);
      
    }



    // Limpiar formulario
  }
}
