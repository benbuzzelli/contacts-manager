import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { ContactsService } from '../contacts/contacts.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-view-contacts',
  templateUrl: './view-contacts.component.html',
  styleUrls: ['./view-contacts.component.css']
})
export class ViewContactsComponent implements OnInit {
  contacts$: Observable<any[]> = null;

  constructor(private contactsService: ContactsService, 
    private db: AngularFireDatabase) { }

  ngOnInit() {
  }

  showContacts() {
    this.contacts$ = this.contactsService.contacts$;
  }

}
