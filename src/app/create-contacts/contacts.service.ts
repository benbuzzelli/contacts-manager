import { Injectable } from '@angular/core';
import { AngularFireAuth } from  "@angular/fire/auth";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { Observable } from 'rxjs';
import { NamesService, FullName } from '../names/names.service';
import * as firebase from 'firebase';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { element } from 'protractor';

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

  // If this is empty, then the table will not display
  searchEmpty: boolean = false;

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

  // Stores the list of contacts ordered by the name key if the user
  // has not input anything into the search field. Otherwise, it orders
  // the contacts by their comparison to the search string
  setSearchContacts(searchStr: string, searchAlpha: boolean) {
    let contactsRef: AngularFirestoreCollection<Contact> = null;
    if (searchStr === null || searchStr === '')
      contactsRef = this.afs.collection<Contact>(`contacts-${this.userId}`, ref => ref.orderBy('name'));
    else
    {
      console.log(searchAlpha);
      if (searchAlpha) 
      {
          // Replace the last character of the search string and increment it by one
          // this will be the upperbound of our search result.
          var upperChar = 1 + searchStr.charCodeAt(searchStr.length-1);
          var stringUpperBoundary = searchStr.substr(0, searchStr.length-1) + String.fromCharCode(upperChar);
          //console.log("upperChar: "+ upperChar + " upperStringBound: " + stringUpperBoundary);
          contactsRef = this.afs.collection<Contact>(`contacts-${this.userId}`, ref => ref.where('name', '>=', searchStr).where('name', "<", stringUpperBoundary));
          console.log(this.afs.collection<Contact>(`contacts-${this.userId}`).ref.get());
      }
      else
      {
        console.log(searchStr);
        contactsRef = this.afs.collection<Contact>(`contacts-${this.userId}`, ref => ref.where('phoneNumbers', 'array-contains', searchStr));
      }
    }
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

  getSearchResults(str: string, searchAlpha: boolean): Observable<any[]> {
    if (str === null || str === '')
      this.setSearchContacts('', true);
    else
      this.setSearchContacts('' + str.toLowerCase(), searchAlpha)
    return this.contacts$;
  }

  // Sets contactRef and adds the new contact. The contact neeeds 
  // to be parsed as a JSON string because that's what Angular Firestore's
  // add function parameter needs to be.
  createContact(contact: Contact)  {
    this.contactsRef = this.afs.collection<Contact>(`contacts-${this.userId}`);
    this.contactsRef.add(JSON.parse(this.getContactJsonString(contact)));
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

  setStoredContact(contact: Contact) {
    localStorage.setItem('selectedContact', JSON.stringify(contact));
  }

  removeStoredContact() {
    localStorage.setItem('selectedContact', null);
  }

  getStoredContact(): Contact {
    return JSON.parse(localStorage.getItem('selectedContact'));
  }
}
