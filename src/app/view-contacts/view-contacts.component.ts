import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { ContactsService } from '../create-contacts/contacts.service';
import { Observable } from 'rxjs';
import { Router } from  "@angular/router";
import { Contact } from '../create-contacts/contacts.service';
import {DataSource} from '@angular/cdk/collections';
import {MatTableModule} from '@angular/material/table';


/**
 * Setup files
 */
@Component({
  selector: 'app-view-contacts',
  templateUrl: './view-contacts.component.html',
  styleUrls: ['./view-contacts.component.css']
})

/**
 * Components to use for viewing contacts table, buttons, and search
 */
export class ViewContactsComponent implements OnInit {
  contacts$: Observable<any[]> = null;
  
  dataSource = this.contacts$;
  displayedColumns: string[] = ['name'];

  constructor(private contactsService: ContactsService, 
    private db: AngularFireDatabase, public router: Router) { }

  ngOnInit() {
  }

  async showContacts() {
    this.contactsService.getContactsList();
    this.contacts$ = this.contactsService.contacts$;
  }

  search() {
    this.contactsService.search();
  }

  deleteContact(contact: Contact) {
    this.contactsService.deleteContact(contact);
  }

}
