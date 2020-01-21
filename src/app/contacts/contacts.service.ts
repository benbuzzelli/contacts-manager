import { Injectable } from '@angular/core';
import { AngularFireAuth } from  "@angular/fire/auth";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { Observable } from 'rxjs';

export class Contact {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;

  constructor(firstName: string, lastName: string, phone: string, email: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.email = email;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  contacts$: Observable<any[]> = null;
  userId: string;

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      if(user) this.userId = user.uid
    })
  }

  getItemsList(): Observable<any[]> {
    if (!this.userId) return;
    this.contacts$ = this.db.list(`contacts/${this.userId}`).valueChanges();
    console.log(this.contacts$ == null);
    this.db.list(`contacts/${this.userId}`).valueChanges().subscribe(console.log);
    return this.contacts$;
  }


  createItem(contact: Contact)  {
    this.getItemsList();
    console.log(contact);
    this.db.list(`contacts/${this.userId}`).push(contact);
  }
}
