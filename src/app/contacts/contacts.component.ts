import { Component, OnInit } from '@angular/core';
import { ContactsService, Contact, FullName } from './contacts.service';
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
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
  phoneNumbers: FormArray;
  
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
      phoneNumbers: this.formBuilder.array([ this.createPhoneNumber(0) ])
    })
  }

  handlePhoneNumbersArray(value: string) {
    this.phoneNumbers = this.createContactForm.get('phoneNumbers') as FormArray;
    let length: number = (this.phoneNumbers.length);

    let empty: number = 0;
    for (let i = 0; i < length; i++)
      if (this.phoneNumbers.get(i.toString()).get('value').value === "")
        empty++;
    
    if (empty > 1) {
      let val: number = empty;
      let index: number = length-1;
      while (val > 1 && index >= 0) {
        if (this.phoneNumbers.get(index.toString()).get('value').value === "") {
          val--;
          console.log("removing: " + index);
          this.phoneNumbers.removeAt(index);
        }
        index--;
      }
    } else if (empty == 0)
      this.addPhoneNumber();
  }

  createPhoneNumber(length: number): FormGroup {
    return this.formBuilder.group({
      type: '',
      value: '',
      index: length,
      canRemove: false
    });
  }

  addPhoneNumber(): void {
    console.log(this.phoneNumbers.get('0').get('type').value)
    this.phoneNumbers = this.createContactForm.get('phoneNumbers') as FormArray;
    this.phoneNumbers.push(this.createPhoneNumber(this.phoneNumbers.length));
  }

  toggleDropdown() {
    this.dropdownToggle = !this.dropdownToggle;
  }

  createContact() {
    this.contactsService.createItem(new Contact(this.fullName));
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
      fullName: fullName.fullName,
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
