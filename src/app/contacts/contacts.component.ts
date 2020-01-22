import { Component, OnInit } from '@angular/core';
import { ContactsService, Contact, FullName } from './contacts.service';
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
  
  dropdownToggle: boolean;

  fullName: FullName = new FullName("","","","","","");

  contacts$: Observable<any[]> = null;
  phoneTypeSelected = 'Mobile';
  emailTypeSelected = 'Work';

  phoneTypes: contactType[] = [
    {value: "Mobile", viewValue: "Mobile"},
    {value: "Work", viewValue: "Work"},
    {value: "Home", viewValue: "Home"}
  ];

  emailTypes: contactType[] = [
    {value: "Work", viewValue: "Work"},
    {value: "Home", viewValue: "Home"}
  ];

  constructor(private contactsService: ContactsService, 
    private db: AngularFireDatabase,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createContactForm = this.formBuilder.group({
      primaryName: '',
      prefix: '',
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      email: '',
      phone: ''
    })

    // this.createContactForm.valueChanges.subscribe()
  }

  toggleDropdown() {
    this.dropdownToggle = !this.dropdownToggle;
  }

  createContact(phone: string, email: string) {
    this.contactsService.createItem(new Contact(this.fullName.fullName, phone, email));
    // this.contacts$ = this.contactsService.contacts;
  }

  showContacts() {
    this.contacts$ = this.contactsService.contacts$;
  }

  listContacts() {
    console.log(this.contactsService.getItemsList());
  }

  setNameValues(primary: string) {
    let fullName: FullName = this.contactsService.getNameValues(primary);

    this.fullName = fullName;

    console.log(fullName.firstName);
    this.createContactForm.patchValue({
      prefix: fullName.prefix,
      firstName: fullName.firstName,
      middleName: fullName.middleName,
      lastName: fullName.lastName,
      suffix: fullName.suffix
    });
  }

  setPrefix(prefix: string) {
    this.fullName.prefix = prefix;
    this.fullName.fullName = this.contactsService.getFullName(this.fullName);
  }

  setFirst(first: string) {
    this.fullName.firstName = first;
    this.fullName.fullName = this.contactsService.getFullName(this.fullName);
  }

  setMiddle(middle: string) {
    this.fullName.middleName = middle;
    this.fullName.fullName = this.contactsService.getFullName(this.fullName);
  }

  setLast(last: string) {
    this.fullName.lastName = last;
    this.fullName.fullName = this.contactsService.getFullName(this.fullName);
  }

  setSuffix(suffix: string) {
    this.fullName.suffix = suffix;
    this.fullName.fullName = this.contactsService.getFullName(this.fullName);
  }
}
