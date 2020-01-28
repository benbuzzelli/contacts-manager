import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { ContactsService } from '../create-contacts/contacts.service';
import { Observable } from 'rxjs';
import { Router } from  "@angular/router";
import { Contact } from '../create-contacts/contacts.service';
import {MatTableModule} from '@angular/material/table';


@Component({
  selector: 'app-view-contacts',
  templateUrl: './view-contacts.component.html',
  styleUrls: ['./view-contacts.component.css']
})
export class ViewContactsComponent implements OnInit {
  contacts$: Observable<any[]> = null;
  
  /**
   * Setup table with column headers to diplsay contacts
   */
  displayedColumns: string[] = ['fullName'];

  constructor(private contactsService: ContactsService, 
    private db: AngularFireDatabase, public router: Router) {
      // Initialise contact$ 
      this.contacts$ = this.contactsService.contacts$;
  }

  ngOnInit() {
    // Set the users contacts in the template on init.
    this.contacts$ = this.contactsService.getContactsList();
  }

  // See method: setContactsList() in create-contacts/contacts.service.ts
  async setContacts() {
    this.contactsService.setContactsList();
  }

  deleteContact(contact: Contact) {
    this.contactsService.deleteContact(contact);
  }

}
