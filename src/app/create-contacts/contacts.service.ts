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

  // Reference to the user's contact collection in Angular Firestore
  contactsRef: AngularFirestoreCollection<Contact> = null;

  constructor(private db: AngularFireDatabase, 
    private afAuth: AngularFireAuth, 
    private namesService: NamesService,
    private afs: AngularFirestore) {
    // Just checks if a user exists and assigns this.userId to it.
    this.afAuth.authState.subscribe(user => {
      if(user) this.userId = user.uid
    })
  }

  setContactsList(): Observable<any[]> {
    // Set contactsRef to be the user's contact collection.
    // If no collection exists, one will be created with the user's id.
    this.contactsRef = this.afs.collection<Contact>(`contacts-${this.userId}`);
    if (!this.userId) return;

    // Set the contacts$ variable using Angular Firestore's snapshotChanges method.
    this.contacts$ = this.contactsRef.snapshotChanges().pipe(map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Contact;

        // Gets the id associated with the document and sets it's id field equal to its id.
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    }));
  }

  // Sets contactRef and adds the new contact. The contact neeeds 
  // to be parsed as a JSON string because that's what Angular Firestore's
  // add function parameter needs to be.
  createContact(contact: Contact)  {
    this.contactsRef = this.afs.collection<Contact>(`contacts-${this.userId}`);
    this.contactsRef.add(JSON.parse(JSON.stringify(contact)));
  }

  // Gets the document with the contact's id and deletes it.
  deleteContact(contact: Contact) {
    this.contactsRef.doc(contact.id).delete();
  }

  // Takes a fullName string and returns a FullName instance,
  // populated appropriately.
  getAllNameValues(primary: string) {
    return this.namesService.getNames(primary);
  }

  // Takes a FullName instance and returns a single string
  // which represents the contact's fullName.
  getDisplayName(fullName: FullName) {
    return this.namesService.getFullName(fullName);
  }
}
