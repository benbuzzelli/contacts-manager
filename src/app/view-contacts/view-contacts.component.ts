import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { ContactsService } from '../contacts/contacts.service';
import { Observable } from 'rxjs';
import { Router } from  "@angular/router";
import { Contact } from '../contacts/contacts.service';

@Component({
  selector: 'app-view-contacts',
  templateUrl: './view-contacts.component.html',
  styleUrls: ['./view-contacts.component.css']
})
export class ViewContactsComponent implements OnInit {
  contacts$: Observable<any[]> = null;

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
