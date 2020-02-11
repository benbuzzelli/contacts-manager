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
  sortName: string;
  phoneNumbers: any[];
  emails: any[];

  constructor(fullName: FullName, phoneNumbers: any[], emails: any[]) {
    this.fullName = fullName;
    this.phoneNumbers = phoneNumbers;
    this.emails = emails;
    //this.sortName = this.sortName;
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

  setContacts:  false;

  // If this is empty, then the table will not display
  searchEmpty: boolean = false;

  // Reference to the user's contact collection in Angular Firestore
  contactsRef: AngularFirestoreCollection<Contact> = null;
  contactNameJustCreated: string;

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
    let phoneRef: AngularFirestoreCollection<Contact> = null;
    if (searchStr === null || searchStr === '') {
      console.log("Setting contacts")
      console.log(this.afs.collectionGroup('contacts'));
      phoneRef = this.afs.collection<Contact>(`contacts-${this.userId}`, ref => ref.orderBy('sortName'));
    }
    else
    {
      var upperChar = 1 + searchStr.charCodeAt(searchStr.length-1);
      var stringUpperBoundary = searchStr.substr(0, searchStr.length-1) + String.fromCharCode(upperChar);
      if (searchAlpha) 
      {
          // Replace the last character of the search string and increment it by one
          // this will be the upperbound of our search result.
          //console.log("upperChar: "+ upperChar + " upperStringBound: " + stringUpperBoundary); 
          phoneRef = this.afs.collection<Contact>(`contacts-${this.userId}`, ref => ref.where('sortName', '>=', searchStr).where('sortName', "<", stringUpperBoundary));
      }
      else
      {
        let refData = [];
        // console.log(this.afs.collection<Contact>(`contacts-${this.userId}`));
        // contactsRef = this.afs.collection<Contact>(`contacts-${this.userId}`, ref => ref.where('name', '>', "0"));
        // contactsRef = this.afs.collection<Contact>(`contacts-${this.userId}`, ref => ref.where('phoneNumbers', 'array-contains', searchStr));
        //contactsRef = this.afs.collection<Contact>(`contacts-${this.userId}`);
        contactsRef = this.afs.collection<Contact>(`contacts-${this.userId}`);
        //phoneRef = this.afs.collection<Contact>(`contacts-${this.userId}`, ref => ref.where("name", "==", "uwu"));
        phoneRef = this.afs.collection<Contact>(`contacts-${this.userId}`);
        contactsRef.get().forEach((a) => {
          // phoneRef = this.afs.collection<Contact>(`contacts-${this.userId}`, ref => ref.where("name", "==", ""));
          // console.log(a.docs[0].data());

          // phoneRef = new AngularFirestoreCollection<Contact>(null, null, this.afs);
          // phoneRef = new this.afs.collection<Contact>(this.ad);
          // console.log("IMPORTANT!!!!!!!!!!!!!!!!!!! " + a.docs.length);
          for (let i = 0; i < a.docs.length; i++) {
            let numbers = a.docs[i].data().phoneNumbers;
            // console.log(numbers.length);
            for (let j = 0; j < numbers.length; j++)
            {
              //console.log("elem: " + i + ", number: " + j);
              // console.log(numbers[j]);
              //console.log("search: " + searchStr + ", " + stringUpperBoundary);
              console.log("Contacts phone number "+ numbers[j].value);
              console.log("Search string " + searchStr);
              if (numbers[j].value >= searchStr && numbers[j].value < stringUpperBoundary)
              //if (numbers[j].value.indexOf(searchStr) != -1)
              {
                let contactData = a.docs[i].data() as Contact;
                //phoneRef.add(data);
                //contactsRef.add(data);
                //let jsonData = JSON.stringify(a.docs[i].data());
                let jsonData = contactData.phoneNumbers[j];
                // if (!jsonData in refData) {
                if (!refData.includes(jsonData)) 
                {
                  console.log("Added contanct: " + contactData.name);
                  refData.push(jsonData);
                }
                  //phoneRef.add(contactData);
                }
            }
          }
          phoneRef = this.afs.collection<Contact>(`contacts-${this.userId}`);
          for (let i = 0; i < refData.length; i++)
          {
            phoneRef = this.afs.collection<Contact>(`contacts-${this.userId}`, ref => ref.where("phoneNumbers", "array-contains", refData[i]));
          }
          // console.log(refData);
          // this.contacts$ = contactsRef.snapshotChanges().pipe(map(actions => {
          //   return actions.map(action => {
          //     const data = action.payload.doc.data() as Contact;
      
          //     // Gets the id associated with the document and sets it's id field equal to its id.
          //     const id = action.payload.doc.id;
          //     console.log(data);
          //     return { id, ...data };
          //   });
          // }));
          // contactsRef.get().subscribe(doc => {
          //   this.searchEmpty = doc.empty;
          // });

        });


        /*this.contacts$ = phoneRef.snapshotChanges().pipe(map(actions => {
          return actions.map(action => {
            const data = action.payload.doc.data() as Contact;
    
            // Gets the id associated with the document and sets it's id field equal to its id.
            const id = action.payload.doc.id;
            // console.log(data);
            return { id, ...data };
          });
        }));
        phoneRef.get().subscribe(doc => {
          this.searchEmpty = doc.empty;
        });*/
      }
    }
    this.contacts$ = phoneRef.snapshotChanges().pipe(map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Contact;
        //console.log(data);

        // Gets the id associated with the document and sets it's id field equal to its id.
        const id = action.payload.doc.id;
        // console.log(data);
        return { id, ...data };
      });
    }));
    phoneRef.get().subscribe(doc => {
      this.searchEmpty = doc.empty;
    });
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
    let noNameStr: string = 'Mr No Name';
    if (contact.phoneNumbers.length > 0)
      noNameStr = contact.phoneNumbers[0].value;
    else if (contact.emails.length > 0)
      noNameStr = contact.emails[0].value;

    if (contact.fullName.fullName === '')
      contact.fullName = this.getAllNameValues(noNameStr)
    else {
      contact.fullName = this.getAllNameValues(this.namesService.nameToCamelCase(contact.fullName.fullName))
    }
    this.contactNameJustCreated = contact.fullName.fullName;
    contact.sortName = this.getSortName(contact.fullName);
    this.contactsRef = this.afs.collection<Contact>(`contacts-${this.userId}`);
    this.contactsRef.add(JSON.parse(JSON.stringify(contact)));
  }

  getSortName(fullName: FullName) {
    let f = fullName.firstName.toLowerCase();
    let l = fullName.lastName.toLowerCase();
    let p = fullName.prefix.toLowerCase();
    let m = fullName.middleName.toLowerCase();
    let s = fullName.suffix.toLowerCase();
    let sortName = f + m + l + p + s;
    return sortName;
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

  getDistinctStr(c1, c2) {
    if (c1 === undefined && c2 === undefined)
      return '';
    let c = c1.sortName.substr(0,1);
    if (c === '')
      c = c1.fullName.firstName.substr(0,1);
    c = this.getGeneralStr(c);

    if (c2 === null)
      return c.toUpperCase();

    let d = c2.fullName.firstName.substr(0,1);
    d = this.getGeneralStr(d);

    if (c !== d)
      return c.toUpperCase();

    return '';
  }

  getGeneralStr(c: string) {
    return this.namesService.getGeneralStr(c)
  }
}
