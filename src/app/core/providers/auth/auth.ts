import { Injectable } from '@angular/core';
import { Auth as AuthFirebase, createUserWithEmailAndPassword, getAuth, getRedirectResult, GoogleAuthProvider, OAuthProvider, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, signOut } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { GlobalEvent } from 'src/app/shared/services/global-event';
import { Crud } from '../crudFirebase/crud';


@Injectable({
  providedIn: 'root'
})
export class Auth {


  constructor(
    private authFirebase: AuthFirebase,
    private globalUidSrv: GlobalEvent,
    private readonly navSrv: NavController,
    private crudSrv: Crud
  ) {

  }

  async getCurrentUser(): Promise<{ userUid: string; userName: string; rol: string } | null> {
    return new Promise((resolve) => {
      const unsubscribe = this.authFirebase.onAuthStateChanged(async (user) => {
        unsubscribe(); // Dejar de escuchar después de obtener el primer estado

        if (user) {
          try {
            const userData: any = await this.crudSrv.getByUid('users', user.uid);
            if (userData && Array.isArray(userData) && userData.length > 0) {
              const userDoc = userData[0];
              resolve({
                userUid: userDoc.uid || user.uid,
                userName: (userDoc.name || '') + ' ' + (userDoc.lastName || ''),
                rol: userDoc.rol || 'user'
              });
              return;
            }
            // Si no hay datos en Firestore pero sí en Auth
            resolve({ userUid: user.uid, userName: user.displayName || '', rol: 'user' });
          } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            resolve({ userUid: user.uid, userName: user.displayName || '', rol: 'user' });
          }
        } else {
          resolve(null);
        }
      });
    });
  }

  async create(email: string, password: string): Promise<string | null> {
    try {

      const resp = await createUserWithEmailAndPassword(
        this.authFirebase,
        email,
        password
      );

      const uid = resp.user.uid;

      this.globalUidSrv.setUid(uid);

      return uid;

    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async login(email: string, password: string): Promise<string | null> {
    try {

      const resp = await signInWithEmailAndPassword(
        this.authFirebase,
        email,
        password
      );

      const request = resp.operationType;

      return request;

    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async loginConGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.authFirebase, provider);
      console.log('Usuario de Google:', result.user);
      if (result.user) {
        await this.syncUserWithDb(result.user);
        this.navSrv.navigateRoot('home')
      }
    } catch (error) {
      console.error('Error en Google:', error);
    }
  }

  async getResiltadosRedirect() {
    const result = await getRedirectResult(this.authFirebase);
    if (result && result.user) {
      await this.syncUserWithDb(result.user);
    }
    return result;
  }

  async loginWithMicrosoft(): Promise<string | null> {
    try {
      const provider = new OAuthProvider('microsoft.com');
      // Opcional: provider.setCustomParameters({ prompt: 'select_account' });

      const resp = await signInWithPopup(this.authFirebase, provider);

      if (resp.user) {
        await this.syncUserWithDb(resp.user);
        this.navSrv.navigateRoot('home');
      }

      return resp.operationType;

    } catch (error) {
      const err = error as any;
      console.error('Error detallado en Microsoft:', err.code, err.message);

      if (err.code === 'auth/account-exists-with-different-credential') {
        alert('Ya existe una cuenta con este correo vinculada a otro proveedor (ej. Google). Por favor, usa el método con el que te registraste originalmente o habilita "Múltiples cuentas por correo" en la consola de Firebase.');
      } else if (err.code === 'auth/popup-blocked') {
        const provider = new OAuthProvider('microsoft.com');
        await signInWithRedirect(this.authFirebase, provider);
      }
      return null;
    }
  }

  async logOut() {
    try {
      await signOut(this.authFirebase);
      await this.navSrv.navigateRoot('login');
    } catch (error) {
      throw error;
    }
  }

  private async syncUserWithDb(user: any) {
    try {
      const userExists = await this.crudSrv.getByUid('users', user.uid);

      if (!userExists || (Array.isArray(userExists) && userExists.length === 0)) {
        console.log('Usuario no existe en BD, registrando...');
        const nameParts = user.displayName ? user.displayName.split(' ') : ['', ''];
        await this.crudSrv.register('users', {
          uid: user.uid,
          doc: '',
          state: 'active',
          rol: 'user',
          name: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: user.email || '',
          password: '',
          department: '',
        }, user.uid);
      } else {
        console.log('Usuario ya existe en BD');
      }
    } catch (error) {
      console.error('Error al sincronizar usuario:', error);
    }
  }
}
