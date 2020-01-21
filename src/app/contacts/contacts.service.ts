import { Injectable } from '@angular/core';
import { AngularFireAuth } from  "@angular/fire/auth";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";

export class Contact {
  name: string;
  phone: string;
  email: string;

  constructor(name: string, phone: string, email: string) {
    this.name = name;
    this.phone = phone;
    this.email = email;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  contacts: AngularFireList<Contact> = null;
  userId: string;

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      if(user) this.userId = user.uid
    })
  }

  getItemsList(): AngularFireList<Contact> {
    if (!this.userId) return;
    this.contacts = this.db.list(`contacts/${this.userId}`);
    console.log(this.contacts == null);
    this.db.list(`contacts/${this.userId}`).valueChanges().subscribe(console.log);
    return this.contacts;
  }


  createItem(contact: Contact)  {
    this.getItemsList();
    console.log(contact);
    this.contacts.push(contact);
  }
}
