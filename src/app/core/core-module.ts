import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore'
import { provideAuth, getAuth} from '@angular/fire/auth';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { environment } from 'src/environments/environment.prod';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [

    provideFirebaseApp(() => initializeApp(environment.FIREBASE_CONFIG)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideMessaging(() => getMessaging()),
  ],
})
export class CoreModule {


}
