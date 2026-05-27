import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, onSnapshot, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IEvents } from 'src/app/interfaces/events.interface';
import { IGoal } from 'src/app/interfaces/goal.interface';
import { IUser, IUserCreate } from 'src/app/interfaces/user.interface';
import { IVisit } from 'src/app/interfaces/visit.interface';


@Injectable({
  providedIn: 'root',
})
export class Crud {
  constructor(private readonly fireSt: Firestore){ }


  async register(collectionName: string, data:any, uid:string){
    try {
      const docRef = doc(this.fireSt, collectionName, uid);
      await setDoc(docRef, data);
      console.log("Documento con", uid);
    } catch (error) {
      throw error;
    }
  }

  async add(collectionName: string, data:any,){
    try {
      const docRef = collection(this.fireSt, collectionName);
      return await addDoc(docRef,data);
    } catch (error) {
      throw error;
    }
  }


   async getAll<T>(collectionName: string){
  try {
    const ref = collection(this.fireSt, collectionName);
    // const q = query(ref, where("uid", "==", id));
    const snapshot = await getDocs(ref);

    if (snapshot.empty) {
      console.warn("No hay usuarios");
      return null;
    }

    return snapshot.docs.map(doc =>({
      id: doc.id,
      ...(doc.data() as T)
    }));
  } catch (error) {
    console.log("Error en getById",error);
    return;
  }
 }


 async delete(collectionName: string, docId: string): Promise<void> {
  try {
    const docRef = doc(this.fireSt, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    throw error;
  }
 }

 async update(collectionName: string, uid: string, data: Partial<any>) {
  try {
    const docRef = doc(this.fireSt, collectionName, uid);
    await updateDoc(docRef, data);
  } catch (error) {
    throw error;
  }
 }

 async getByUid(collectionName: string, uid: string){
  try {
    const ref = collection(this.fireSt, collectionName);
    const q = query(ref, where("uid", "==", uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn("No hay usuario con esa uid")
      return null;
    }else{
      return snapshot.docs.map(doc => ({
        uid: doc.id,
        docId: doc.id,
        ...(doc.data() as IUserCreate)
      }));
    }

  } catch (error) {
    console.log('Error al obtener', error);
    return;
  }
 }

 async getNotifications(uid: string) {
  try {
    const ref = collection(this.fireSt, 'notifications');
    const q = query(ref, where('to', '==', uid));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return [];
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => new Date(b['date']).getTime() - new Date(a['date']).getTime());
  } catch (error) {
    console.error('Error getting notifications', error);
    return [];
  }
 }

 async getByPdv(collectionName: string, pdv: string) {
  try {
    const ref = collection(this.fireSt, collectionName);
    const q = query(ref, where("pdv", "==", pdv));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as IEvents)
    }));
  } catch (error) {
    console.log('Error getting events by pdv', error);
    return [];
  }
}

 async getByDoc(collectionName: string, doc: string) {
  try {
    const ref = collection(this.fireSt, collectionName);
    const q = query(ref, where("doc", "==", doc));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as IUser)
    }));
  } catch (error) {
    console.log('Error getting user dy doc', error);
    return [];
  }
}


async getGoalByDocAndMonth(collectionName: string, document: string, month: string){
    try {
      const ref = collection(this.fireSt, collectionName);
      const q = query(ref, where("doc", "==", document), where("month", "==", month))
      const snapshot = await getDocs(q);

      if(snapshot.empty){
        return [];
      }

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as IGoal)
      }));
    } catch (error) {
      console.log('Error getting visits', error);
      return[];
    }
 }
 async getVisitsByDocAndMonth(collectionName: string, document: string, month: string){
    try {
      const ref = collection(this.fireSt, collectionName);
      const q = query(ref, where("doc", "==", document), where("month", "==", month))
      const snapshot = await getDocs(q);

      if(snapshot.empty){
        return [];
      }

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as IVisit)
      }));
    } catch (error) {
      console.log('Error getting visits', error);
      return[];
    }
 }

  // ── Listeners en tiempo real (onSnapshot) ────────────────────────────────

  listenNotifications(uid: string): Observable<any[]> {
    return new Observable(observer => {
      const ref = collection(this.fireSt, 'notifications');
      const q = query(ref, where('to', '==', uid));
      const unsub = onSnapshot(q, snapshot => {
        const data = snapshot.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a: any, b: any) => new Date(b['date']).getTime() - new Date(a['date']).getTime());
        observer.next(data);
      }, err => observer.error(err));
      return () => unsub();
    });
  }

  listenTasksByUid(uid: string): Observable<any[]> {
    return new Observable(observer => {
      const ref = collection(this.fireSt, 'tasks');
      const q = query(ref, where('uid', '==', uid));
      const unsub = onSnapshot(q, snapshot => {
        const data = snapshot.docs.map(d => ({ id: d.id, docId: d.id, ...d.data() }));
        observer.next(data);
      }, err => observer.error(err));
      return () => unsub();
    });
  }

  listenEventsByUid(uid: string): Observable<any[]> {
    return new Observable(observer => {
      const ref = collection(this.fireSt, 'events');
      const q = query(ref, where('uid', '==', uid));
      const unsub = onSnapshot(q, snapshot => {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        observer.next(data);
      }, err => observer.error(err));
      return () => unsub();
    });
  }

}
