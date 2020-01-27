import { Component, OnInit } from '@angular/core';
import { ContactsService, Contact } from './contacts.service';
import { FullName } from '../names/names.service';
import { AngularFireDatabase } from "@angular/fire/database";
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Router } from  "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

export class ContactType {
  value: string;
  viewValue: string;
  inUse: boolean;
}

@Component({
  selector: 'app-contacts',
  templateUrl: './create-contacts.component.html',
  styleUrls: ['./create-contacts.component.css']
})
export class ContactsComponent implements OnInit {
  createContactForm: FormGroup;
  phoneNumbers: FormArray;
  emails: FormArray;
  
  // When true, the name dropdown shows, which lets the user
  // input more name field values.
  dropdownToggle: boolean;

  // Array of ContactType's for the phone types to populate the phone number select options
  phoneTypes: ContactType[] = [
    {value: "Mobile", viewValue: "Mobile", inUse: false},
    {value: "Work", viewValue: "Work", inUse: false},
    {value: "Home", viewValue: "Home", inUse: false},
    {value: "Other", viewValue: "Other", inUse: false}
  ];

  // Array of ContactType's for the email types to populate the email select options
  emailTypes: ContactType[] = [
    {value: "Work", viewValue: "Work", inUse: false},
    {value: "Home", viewValue: "Home", inUse: false},
    {value: "Other", viewValue: "Other", inUse: false}
  ];

  constructor(private contactsService: ContactsService, 
    private db: AngularFireDatabase,
    private formBuilder: FormBuilder, 
    public router: Router,
    public dialog: MatDialog,
    private _createdContactSnackBar: MatSnackBar) { }

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

  // Adds a new phone number input field into the template
  addPhoneNumber(): void {
    this.phoneNumbers = this.createContactForm.get('phoneNumbers') as FormArray;
    this.phoneNumbers.push(this.createPhoneNumber(this.phoneNumbers.length));
  }

  // Adds a new email input field into the template
  addEmail(): void {
    this.emails = this.createContactForm.get('emails') as FormArray;
    this.emails.push(this.createEmail(this.emails.length));
  }

  // Toggles the dropDownToggle boolean
  toggleDropdown() {
    this.dropdownToggle = !this.dropdownToggle;
  }

  openContactCreatedSnackBar(action: string) {
    let message = this.createContactForm.get('primaryName').value;
    this._createdContactSnackBar.open(message, action, {
      duration: 2000,
    });
  }

  // Creates a new contact with the input values from createContactForm
  createContact() {
    // Retrieves the raw data values of phoneNumbers and emails from createContactForm,
    // and stores them into two separate arrays.
    let phoneNumbers: any[] = (this.createContactForm.get('phoneNumbers') as FormArray).getRawValue();
    let emails: any[] = (this.createContactForm.get('emails') as FormArray).getRawValue();

    // Removes the last element from phoneNumbers and emails if
    // they are "empty".
    if (phoneNumbers[phoneNumbers.length-1].value === "")
      phoneNumbers.pop();
    if (emails[emails.length-1].value === "")
      emails.pop();

    this.contactsService.createContact(new Contact(this.getFullName(), phoneNumbers, emails));
  }

  // Removes or adds a new phone number input field whether or not
  // there is no empty phone number input field.
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

  // Removes or adds a new email input field whether or not
  // there is no empty email input field.
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

  // Returns a new FormGroup instance for phone numbers
  createPhoneNumber(length: number): FormGroup {
    return this.formBuilder.group({
      type: this.getDefaultedPhoneType(),
      value: '',
      index: length,
      canRemove: false
    });
  }

  // Returns a new FormGroup instance for email
  createEmail(length: number): FormGroup {
    return this.formBuilder.group({
      type: this.getDefaultedEmailType(),
      value: '',
      index: length,
      canRemove: false
    });
  }

  // Returns the type of phone number to be displayed, based on which
  // types are currently in use.
  getDefaultedPhoneType() {
    for (let i = 0; i < this.phoneTypes.length; i++) {
      if (!this.phoneTypes[i].inUse)
        return this.phoneTypes[i].viewValue;
    }
    return this.phoneTypes[this.phoneTypes.length-1].viewValue;
  }

  // Returns the type of email to be displayed, based on which
  // types are currently in use.
  getDefaultedEmailType() {
    for (let i = 0; i < this.emailTypes.length; i++) {
      if (!this.emailTypes[i].inUse)
        return this.emailTypes[i].viewValue;
    }
    return this.emailTypes[this.emailTypes.length-1].viewValue;
  }

  // Loops through the phone number and email types
  // and sets their inUse value to true if they are equal
  // to the createContactForm phone number or email type.
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

  // Checks all formGroup values to see if the form is filled
  formIsFilled(): boolean {
    let emails: FormArray = this.createContactForm.get('emails') as FormArray;
    let phoneNumbers: FormArray = this.createContactForm.get('phoneNumbers') as FormArray;

    if (this.createContactForm.get('primaryName').value != "")
      return true;

    for (let i = 0; i < emails.length; i++)
      if (emails.get(i.toString()).get('value').value != "")
        return true;

    for (let i = 0; i < phoneNumbers.length; i++)
      if (phoneNumbers.get(i.toString()).get('value').value != "")
        return true;

    return false
  }

  // Called whenever a user inputs into the primaryName field.
  // Patches the values in createContactForm with the updated
  // values for prefix, first, middle, last name, and suffix,
  // which change based on the input primary name.
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

  // Returns a FullName instance which is 
  // created using the createContactForm values.
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

  // Updates the formGroup variable, "primaryName". This is
  // called whenever a user inputs into the fields for a contact's
  // prefix, first, middle, last name, and suffix.
  updatePrimary() {
    let primaryName: string = this.contactsService.getDisplayName(this.getFullName());
    this.createContactForm.patchValue({
      primaryName: primaryName
    });
  }

  // Opens the edit dialog to give a user the option to either discard their changes,
  // or keep creating the new contact.
  openEditDialog() {
    if (!this.formIsFilled()) {
      this.router.navigate(['view-contacts']);
      return;
    }

    let dialogRef = this.dialog.open(EditDialogComponent);

    dialogRef.afterClosed().subscribe(res => {
      if (res === "discard")
        this.router.navigate(['view-contacts']);
    })

  }
}
