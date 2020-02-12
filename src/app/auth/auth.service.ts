import { Injectable } from '@angular/core';
import { Router } from  "@angular/router";
import { AngularFireAuth } from  "@angular/fire/auth";
import { User } from  'firebase';
import { NotificationService } from '../notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;

  constructor(public  afAuth:  AngularFireAuth, public  router:  Router,
    private notificationService: NotificationService) {
    // Adds the user to localStorage if there is one.
    this.afAuth.authState.subscribe(user => {
      if (user){
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('uid', JSON.stringify(this.user.uid))
      } else {
        localStorage.setItem('user', null);
        localStorage.setItem('uid', null);
      }
    });
  }

  // Returns true if the user has verified their email
  get isAuthenticated(): boolean {
    return this.user.emailVerified
  }

  // Logs a user in and either navigates to the view-contacts page,
  // or logs the user out if they are not yet authenticated.
  async login(email: string, password: string) {
    try {
      var result = await this.afAuth.auth.signInWithEmailAndPassword(email, password)
      if (this.isAuthenticated) {
        this.router.navigate(['view-contacts']);
        this.notificationService.notification$.next({message: email, action: 'Logged in!'});
      } else {
        this.logout();
        this.notificationService.notification$.next({message: 'Account not yet verified', action: ''});
      }
    } catch(e) {
      this.notificationService.notification$.next({message: e.message, action: ''});
    }
  }

  // Sends email verification and navigates to the verify-email page.
  async sendEmailVerification() {
    await this.afAuth.auth.currentUser.sendEmailVerification()
    this.router.navigate(['verify-email']);
  }

  // Send a verification email and then logs the user out.
  async register(email: string, password: string) {
    try {
      var result = await this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      this.sendEmailVerification();
      this.logout();
      this.notificationService.notification$.next({message: email, action: 'Registered!'});
    } catch(e) {
      this.notificationService.notification$.next({message: e.message, action: ''});
    }
  }

  // Routes to the login page after the password reset email has been sent.
  async sendPasswordResetEmail(passwordResetEmail: string) {
    await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
    this.router.navigate(['login']);
  }

  // Removes the user from the local storage as well as singing it out.
  // Then navigates to the login page.
  async logout(){
    await this.afAuth.auth.signOut();
    localStorage.removeItem('user');
    localStorage.removeItem('uid');
    this.router.navigate(['login']);
    this.notificationService.notification$.next({message: 'Logged out', action: 'goodbye :)'});
  }

  // Confirms if a user is logged in.
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }
}
