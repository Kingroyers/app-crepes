import { Injectable } from '@angular/core';
import { Observable, from, switchMap, of } from 'rxjs';
import { Auth } from 'src/app/core/providers/auth/auth';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';
import { ITask } from 'src/app/interfaces/task.interface';

@Injectable({
  providedIn: 'root',
})
export class Task {

  constructor(private readonly crudSrv: Crud, private readonly authSrv: Auth){}


  async updateTask(docId: string, task: Partial<ITask>): Promise<void> {
    await this.crudSrv.update('tasks', docId, task);
  }

  async deleteTask(docId: string): Promise<void> {
    await this.crudSrv.delete('tasks', docId);
  }

  async createTask(task: ITask): Promise<void>{
    try {
      const user = await this.authSrv.getCurrentUser();

      const ownerName = user?.userName;

      const uid = user?.userUid;

      if(uid != null){
        await this.crudSrv.add('tasks', {
          uid,
          ownerName: ownerName,
          title: task.title,
          limitDate: task.limitDate,
          description: task.description,
          link: task.link,
          important: task.important
        });

        console.log('Save task works');

      }else{
        console.log("No uid no se agrega");
      }
    } catch (error) {
      console.log('Error al guardar tarea', error);
    }
  }

  /** Escucha tareas en tiempo real para el usuario actual */
  listenMyTasks(): Observable<ITask[]> {
    return from(this.authSrv.getCurrentUser()).pipe(
      switchMap(user => {
        if (!user?.userUid) return of([] as ITask[]);
        return this.crudSrv.listenTasksByUid(user.userUid) as Observable<ITask[]>;
      })
    );
  }
}
