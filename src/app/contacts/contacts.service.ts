import { Injectable } from '@angular/core';
import { AngularFireAuth } from  "@angular/fire/auth";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { Observable } from 'rxjs';
import { NamesService, FullName } from '../names/names.service';

export class Contact {
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
  contacts$: Observable<any[]> = null;
  userId: string;

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, private namesService: NamesService) {
    this.afAuth.authState.subscribe(user => {
      if(user) this.userId = user.uid
    })
  }

  getContactsList(): Observable<any[]> {
    if (!this.userId) return;
    this.contacts$ = this.db.list(`contacts/${this.userId}`).valueChanges();
    this.db.list(`contacts/${this.userId}`).valueChanges().subscribe(console.log);
    return this.contacts$;
  }


  createContact(contact: Contact)  {
    this.getContactsList();
    this.db.list(`contacts/${this.userId}`).push(contact);
  }

  getAllNameValues(primary: string) {
    return this.namesService.getNames(primary);
  }

  getDisplayName(fullName: FullName) {
    return this.namesService.getFullName(fullName);
  }
}
