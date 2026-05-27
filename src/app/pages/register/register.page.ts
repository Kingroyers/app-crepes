import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/shared/services/user/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {

  name!: FormControl;
  lastName!: FormControl;
  department!: FormControl;
  email!: FormControl;
  password!: FormControl;

  registerForm!: FormGroup;




  constructor(private readonly userSrv: User, private readonly navSrv: NavController) {
    this.initForm();
   }

  ngOnInit() {
  }

 async registerUser(){

  await this.userSrv.createUser(this.registerForm.value).then((result) => {
    this.navSrv.navigateRoot('home')
  }).catch((error) =>{

    console.log(error);

  })


  }

  private initForm(){
    this.name = new FormControl('', [Validators.required]);
    this.lastName = new FormControl('', [Validators.required]);
    this.department = new FormControl('', [Validators.required]);
    this.email = new FormControl('', [Validators.required]);
    this.password = new FormControl('', [Validators.required]);

    this.registerForm = new FormGroup({
      name: this.name,
      lastName: this.lastName,
      department: this.department,
      email: this.email,
      password: this.password
    });
  }
}
