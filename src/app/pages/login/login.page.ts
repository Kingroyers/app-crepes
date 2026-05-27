import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Auth } from 'src/app/core/providers/auth/auth';
import { User } from '../../shared/services/user/user';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  picture: string | null = '';
  name: string | null = '';
  emailF: string | null = '';

  email!: FormControl;
  password!: FormControl;
  loginForm!: FormGroup;

  constructor(private authSrv: Auth, private readonly navSrv: NavController, private readonly notificationSrv: NotificationService) {
    this.initForm();
  }

  async ngOnInit() {
    try {
      const res = await this.authSrv.getResiltadosRedirect();

      if (res && res.user) {
        const user = res.user;
        console.log('usuario logeado', user);

        console.log(this.picture = user.photoURL,
          this.name = user.displayName,
          this.emailF = user.email);


          await this.notificationSrv.setupPushNotifications();
          this.navSrv.navigateRoot('home');
      }
    } catch (error) {
    console.log(error);

    }
  }

  private initForm() {
    this.email = new FormControl('', [
      Validators.required,
      Validators.email
    ]);

    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]);

    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password,
    });
  }


  async login() {
    const request = await this.authSrv.login(this.email.value, this.password.value);

    if (request === 'signIn') {
      await this.notificationSrv.setupPushNotifications();
      this.navSrv.navigateRoot('home');
    } else {
      console.log('nada');
    }

  }
  async loginWithGoogle(): Promise<void> {
    this.authSrv.loginConGoogle();
  }

  async loginWithMicrosoft(): Promise<void> {
    const uid = await this.authSrv.loginWithMicrosoft();

    if (uid) {
      await this.notificationSrv.setupPushNotifications();
      this.navSrv.navigateRoot('home');
    } else {
      console.log('Error al iniciar sesión con Microsoft');
    }
  }

  goToRegister(): void {
    this.navSrv.navigateForward('register');
  }

}
