import { Component, OnInit } from '@angular/core';
import { ContactsService, Contact } from './contacts.service';
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';

export class contactType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  createContactForm: FormGroup;
  contacts$: Observable<any[]> = null;

  phoneTypes: contactType[] = [
    {value: "Mobile", viewValue: "Mobile"},
    {value: "Work", viewValue: "Work"},
    {value: "Home", viewValue: "Home"}
  ];

  emailTypes: contactType[] = [
    {value: "Home", viewValue: "Home"},
    {value: "Work", viewValue: "Work"},
    {value: "Mobile", viewValue: "Mobile"}
  ];

  constructor(private contactsService: ContactsService, 
    private db: AngularFireDatabase,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createContactForm = this.formBuilder.group({
      name: '',
      email: '',
      phone: ''
    })

    this.createContactForm.valueChanges.subscribe(console.log)
  }

  createContact(firstName: string, lastName: string, phone: string, email: string) {
    this.contactsService.createItem(new Contact(firstName, lastName, phone, email));
    // this.contacts$ = this.contactsService.contacts;
  }

  showContacts() {
    this.contacts$ = this.contactsService.contacts$;
  }

  listContacts() {
    console.log(this.contactsService.getItemsList());
  }
}
