import { Component, OnInit } from '@angular/core';
import { ContactsService, Contact } from './contacts.service';
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  createContactForm: FormGroup;

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

  createContact(name: string, phone: string, email: string) {
    this.contactsService.createItem(new Contact(name, phone, email));
  }

  listContacts() {
    console.log(this.contactsService.getItemsList());
  }
}
