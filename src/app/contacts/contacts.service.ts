import { Injectable } from '@angular/core';
import { AngularFireAuth } from  "@angular/fire/auth";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { Observable } from 'rxjs';
import { NamesService, FullName } from '../names/names.service';
import * as firebase from 'firebase';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

export class Contact {
  id: string
  fullName: FullName
  phoneNumbers: any[];
  emails: any[];

  constructor(fullName: FullName, phoneNumbers: any[], emails: any[]) {
    this.fullName = fullName;
    this.phoneNumbers = phoneNumbers;
    this.emails = emails;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  baseDBUrl: string;
  contacts$: Observable<Contact[]> = null;
  userId: string;
  contactsRef: AngularFirestoreCollection<Contact> = null;

  constructor(private db: AngularFireDatabase, 
    private afAuth: AngularFireAuth, 
    private namesService: NamesService,
    private afs: AngularFirestore) {
    this.afAuth.authState.subscribe(user => {
      if(user) this.userId = user.uid
    })
  }

  getContactsList(): Observable<any[]> {
    this.contactsRef = this.afs.collection<Contact>(`contacts-${this.userId}`);
    if (!this.userId) return;
    this.contacts$ = this.contactsRef.snapshotChanges().pipe(map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Contact;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    }));
    return this.contacts$;
  }

  search() {
    this.contactsRef = this.afs.collection<Contact>(`contacts-${this.userId}`);
  }

  createContact(contact: Contact)  {
    this.contactsRef = this.afs.collection<Contact>(`contacts-${this.userId}`);
    this.getContactsList();
    this.contactsRef.add(JSON.parse(JSON.stringify(contact)));
  }

  deleteContact(contact: Contact) {
    console.log("contact: " + contact);
    this.contactsRef.doc(contact.id).delete();
  }

  getAllNameValues(primary: string) {
    return this.namesService.getNames(primary);
  }

  getDisplayName(fullName: FullName) {
    return this.namesService.getFullName(fullName);
  }
}
