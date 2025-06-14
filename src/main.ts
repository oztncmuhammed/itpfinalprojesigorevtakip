import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA33DyMOPBAi8qnm4XIaCNwRrEtQgVxm8Q',
  authDomain: 'gorevtakip-e7e13.firebaseapp.com',
  projectId: 'gorevtakip-e7e13',
  storageBucket: 'gorevtakip-e7e13.firebasestorage.app',
  messagingSenderId: '748400710196',
  appId: '1:748400710196:web:02a411afd49866b3fab061',
};

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    importProvidersFrom(
      AngularFireModule.initializeApp(firebaseConfig),
      AngularFirestoreModule,
      AngularFireAuthModule
    ),
  ],
}).catch((err) => console.error(err));
