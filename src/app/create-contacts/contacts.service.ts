import { Injectable } from '@angular/core';
import { AngularFireAuth } from  "@angular/fire/auth";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { Observable } from 'rxjs';
import { NamesService, FullName } from '../names/names.service';
import * as firebase from 'firebase';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

export class Contact {
  id: string;
  name: string;
  fullName: FullName;
  phoneNumbers: any[];
  emails: any[];

  constructor(fullName: FullName, phoneNumbers: any[], emails: any[]) {
    this.fullName = fullName;
    this.phoneNumbers = phoneNumbers;
    this.emails = emails;

    this.name = fullName.fullName.toLowerCase();
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
    if (localStorage.getItem('uid') != null)
      this.userId = localStorage.getItem('uid').replace(/\"/g, "")
  }

  setContactsList(): void {
    if (this.userId === null) return;
    // Set contactsRef to be the user's contact collection.
    // If no collection exists, one will be created with the user's id.
    this.contactsRef = this.afs.collection<Contact>(`contacts-${this.userId}`, ref => ref.orderBy('name'));
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

  getContactsList(): Observable<any[]> {
    this.setContactsList();
    return this.contacts$;
  }

  searchEmpty: boolean = false;
  setSearchContacts(searchStr: string) {
    let contactsRef: AngularFirestoreCollection<Contact> = null;
    if (searchStr === null || searchStr === '')
      contactsRef = this.afs.collection<Contact>(`contacts-${this.userId}`, ref => ref.orderBy('name'));
    else 
      contactsRef = this.afs.collection<Contact>(`contacts-${this.userId}`, ref => ref.orderBy('searchIndex' + searchStr));
    this.contacts$ = contactsRef.snapshotChanges().pipe(map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Contact;

        // Gets the id associated with the document and sets it's id field equal to its id.
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    }));
    contactsRef.get().subscribe(doc => {
      this.searchEmpty = doc.empty;
    })
  }

  getSearchResults(str: string): Observable<any[]> {
    if (str === null || str === '')
      this.setSearchContacts('');
    else
      this.setSearchContacts('.' + str.toLowerCase())
    return this.contacts$;
  }

  // Sets contactRef and adds the new contact. The contact neeeds 
  // to be parsed as a JSON string because that's what Angular Firestore's
  // add function parameter needs to be.
  createContact(contact: Contact)  {
    this.contactsRef = this.afs.collection<Contact>(`contacts-${this.userId}`);
    this.contactsRef.add(JSON.parse(this.getContactJsonString(contact)));
    this.setContactsList();
  }

  // Creates string in json format representing the contact.
  // This also adds key's under "searchIndex" which represent
  // valid searches for that contact.
  getContactJsonString(contact: Contact) {
    let contactString: string = JSON.stringify(contact);
    let searchIndexString = ',"searchIndex":{';
    for (let i = 0; i < contact.name.length; i++) {
      let strIndex = '"' + contact.name.substring(0, i+1).toLowerCase() + '":"true"';
      if (i < contact.name.length-1)
        strIndex += ','
      searchIndexString += strIndex;
    }
    searchIndexString += '}}'
    contactString = contactString.slice(0,contactString.length-1) + searchIndexString;
    return contactString;
  }

  // Gets the document with the contact's id and deletes it.
  deleteContact(contact: Contact) {
    this.contactsRef = this.afs.collection<Contact>(`contacts-${this.userId}`);
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
