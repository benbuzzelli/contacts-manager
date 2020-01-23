import { Component, OnInit } from '@angular/core';
import { ContactsService, Contact } from './contacts.service';
import { FullName } from '../names/names.service';
import { AngularFireDatabase } from "@angular/fire/database";
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

export class contactType {
  value: string;
  viewValue: string;
  inUse: boolean;
}

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  createContactForm: FormGroup;
  phoneNumbers: FormArray;
  emails: FormArray;
  
  dropdownToggle: boolean;

  phoneTypes: contactType[] = [
    {value: "Mobile", viewValue: "Mobile", inUse: false},
    {value: "Work", viewValue: "Work", inUse: false},
    {value: "Home", viewValue: "Home", inUse: false},
    {value: "Other", viewValue: "Other", inUse: false}
  ];

  emailTypes: contactType[] = [
    {value: "Work", viewValue: "Work", inUse: false},
    {value: "Home", viewValue: "Home", inUse: false},
    {value: "Other", viewValue: "Other", inUse: false}
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
      emails: this.formBuilder.array([ this.createEmail(0) ]),
      phoneNumbers: this.formBuilder.array([ this.createPhoneNumber(0) ])
    })
  }

  addPhoneNumber(): void {
    this.phoneNumbers = this.createContactForm.get('phoneNumbers') as FormArray;
    this.phoneNumbers.push(this.createPhoneNumber(this.phoneNumbers.length));
  }

  addEmail(): void {
    this.emails = this.createContactForm.get('emails') as FormArray;
    this.emails.push(this.createEmail(this.emails.length));
  }

  toggleDropdown() {
    this.dropdownToggle = !this.dropdownToggle;
  }

  createContact() {
    this.contactsService.createContact(new Contact(this.getFullName(), this.phoneNumbers.getRawValue(), this.emails.getRawValue()));
  }

  handlePhoneArray(value: string) {
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
    } else if (empty == 0) {
      this.setTypesInUse();
      this.addPhoneNumber();
    }
  }

  handleEmailArray(value: string) {
    this.emails = this.createContactForm.get('emails') as FormArray;
    let length: number = (this.emails.length);

    let empty: number = 0;
    for (let i = 0; i < length; i++)
      if (this.emails.get(i.toString()).get('value').value === "")
        empty++;
    
    if (empty > 1) {
      let val: number = empty;
      let index: number = length-1;
      while (val > 1 && index >= 0) {
        if (this.emails.get(index.toString()).get('value').value === "") {
          val--;
          console.log("removing: " + index);
          this.emails.removeAt(index);
        }
        index--;
      }
    } else if (empty == 0) {
      this.setTypesInUse();
      this.addEmail();
    }
  }

  createPhoneNumber(length: number): FormGroup {
    return this.formBuilder.group({
      type: this.getDefaultedPhoneType(),
      value: '',
      index: length,
      canRemove: false
    });
  }

  createEmail(length: number): FormGroup {
    return this.formBuilder.group({
      type: this.getDefaultedEmailType(),
      value: '',
      index: length,
      canRemove: false
    });
  }

  getDefaultedPhoneType() {
    for (let i = 0; i < this.phoneTypes.length; i++) {
      if (!this.phoneTypes[i].inUse)
        return this.phoneTypes[i].viewValue;
    }
    return this.phoneTypes[this.phoneTypes.length-1].viewValue;
  }

  getDefaultedEmailType() {
    for (let i = 0; i < this.emailTypes.length; i++) {
      if (!this.emailTypes[i].inUse)
        return this.emailTypes[i].viewValue;
    }
    return this.emailTypes[this.emailTypes.length-1].viewValue;
  }

  setTypesInUse() {
    this.phoneNumbers = this.createContactForm.get('phoneNumbers') as FormArray;
    for (let j = 0; j < this.phoneTypes.length; j++) {
      this.phoneTypes[j].inUse = false;
    }

    for (let i = 0; i < this.phoneNumbers.length; i++) {
      for (let j = 0; j < this.phoneTypes.length; j++) {
        if (this.phoneNumbers.get(i.toString()).get('type').value === this.phoneTypes[j].viewValue)
          this.phoneTypes[j].inUse = true;
      }
    }

    this.emails = this.createContactForm.get('emails') as FormArray;
    for (let j = 0; j < this.emailTypes.length; j++) {
      this.emailTypes[j].inUse = false;
    }

    for (let i = 0; i < this.emails.length; i++) {
      for (let j = 0; j < this.emailTypes.length; j++) {
        if (this.emails.get(i.toString()).get('type').value === this.emailTypes[j].viewValue)
          this.emailTypes[j].inUse = true;
      }
    }
  }

  setNameValues(primary: string) {
    let fullName: FullName = this.contactsService.getAllNameValues(this.createContactForm.get('primaryName').value);

    this.createContactForm.patchValue({
      primaryName: fullName.fullName,
      prefix: fullName.prefix,
      firstName: fullName.firstName,
      middleName: fullName.middleName,
      lastName: fullName.lastName,
      suffix: fullName.suffix
    });
  }

  getFullName() {
    return new FullName(
      this.createContactForm.get('primaryName').value,
      this.createContactForm.get('prefix').value,
      this.createContactForm.get('firstName').value,
      this.createContactForm.get('middleName').value,
      this.createContactForm.get('lastName').value,
      this.createContactForm.get('suffix').value
    );
  }

  updatePrimary() {
    let primaryName: string = this.contactsService.getDisplayName(this.getFullName());
    this.createContactForm.patchValue({
      primaryName: primaryName
    });
  }
}
