import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { routes } from './app.routes';


const firebaseConfig = {
  apiKey: "AIzaSyDOv24EDgzGxCOVx6PJ4jxs5zNTD7vLUpo",
  authDomain: "proyecto-modulo-1.firebaseapp.com",
  projectId: "proyecto-modulo-1",
  storageBucket: "proyecto-modulo-1.firebasestorage.app",
  messagingSenderId: "936515232047",
  appId: "1:936515232047:web:fc97371d083e172e2f41da",
  measurementId: "G-4B4KFNECVB"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
  ]
};
