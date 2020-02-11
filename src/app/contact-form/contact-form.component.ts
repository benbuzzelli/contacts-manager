import { Component, OnInit, Input } from '@angular/core';
import { ContactsService, Contact } from '../create-contacts/contacts.service';
import { FullName } from '../names/names.service';
import { AngularFireDatabase } from "@angular/fire/database";
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Router } from  "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactFormService } from './contact-form.service';

export class ContactType {
  value: string;
  viewValue: string;
  inUse: boolean;
}

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {
  @Input() contactForm: FormGroup;

  nameTypes: [{},{},{},{},{},{}] = [
    {controlName: 'primaryName', value: 'Name'},
    {controlName: 'prefix', value: 'Prefix'},
    {controlName: 'firstName', value: 'First name'},
    {controlName: 'middleName', value: 'Middle name'},
    {controlName: 'lastName', value: 'Last name'},
    {controlName: 'suffix', value: 'Suffix'}
  ]

  otherTypes: [{},{}] = [
    {controlName: 'phoneNumbers', value: 'Phone #', typeVarName: 'phoneTypes'},
    {controlName: 'emails', value: 'Email', typeVarName: 'emailTypes'}
  ]

  phoneNumbers: FormArray;
  emails: FormArray;
  
  // When true, the name dropdown shows, which lets the user
  // input more name field values.
  dropdownToggle: boolean;

  constructor(private contactsService: ContactsService, 
    private db: AngularFireDatabase,
    private formBuilder: FormBuilder, 
    public router: Router,
    public dialog: MatDialog,
    private _createdContactSnackBar: MatSnackBar,
    public contactFormService: ContactFormService) { 
  
    router.events.subscribe((val) => {
      this.contactFormService.initialisePhoneAndEmailTypes();
    });
  }

  ngOnInit() {
    // this.initPhoneAndEmail();
  }

  initPhoneAndEmail() {
    this.addPhoneOrEmail();
  }

  // Adds a new phone number input field into the template
  addPhoneOrEmail(): void {
    this.phoneNumbers = this.contactForm.get('phoneNumbers') as FormArray;
    this.contactFormService.addPhoneOrEmail(this.phoneNumbers, this.contactFormService.phoneTypeString);

    this.emails = this.contactForm.get('emails') as FormArray;
    this.contactFormService.addPhoneOrEmail(this.emails, this.contactFormService.emailTypeString);
  }

  // Toggles the dropDownToggle boolean
  toggleDropdown() {
    this.dropdownToggle = !this.dropdownToggle;
  }

  // Removes or adds a new phone number input field whether or not
  // there is no empty phone number input field.
  handlePhoneAndEmailArrays(value: string, kind: string) {
    let type = kind === 'emails' ? 'emailTypes' : 'phoneTypes';
    this[kind] = this.contactForm.get(kind) as FormArray;
    this.contactFormService.handlePhoneAndEmailArrays(value, this[kind], type);
  }

  // Loops through the phone number and email types
  // and sets their inUse value to true if they are equal
  // to the contactForm phone number or email type.
  setTypesInUse() {
    this.phoneNumbers = this.contactForm.get('phoneNumbers') as FormArray;
    this.emails = this.contactForm.get('emails') as FormArray;

    this.contactFormService.setTypesInUse(this.phoneNumbers, 'phoneTypes');
    this.contactFormService.setTypesInUse(this.emails, 'emailTypes');
  }

  // Called whenever a user inputs into the primaryName field.
  // Patches the values in contactForm with the updated
  // values for prefix, first, middle, last name, and suffix,
  // which change based on the input primary name.
  setNameValues(primary: string) {    
    let fullName: FullName = this.contactsService.getAllNameValues(this.contactForm.get('primaryName').value);

    this.contactForm.patchValue({
      primaryName: fullName.fullName,
      prefix: fullName.prefix,
      firstName: fullName.firstName,
      middleName: fullName.middleName,
      lastName: fullName.lastName,
      suffix: fullName.suffix
    });
  }

  // Returns a FullName instance which is 
  // created using the contactForm values.
  getFullName() {
    return new FullName(
      this.contactForm.get('primaryName').value,
      this.contactForm.get('prefix').value,
      this.contactForm.get('firstName').value,
      this.contactForm.get('middleName').value,
      this.contactForm.get('lastName').value,
      this.contactForm.get('suffix').value
    );
  }

  // Updates the formGroup variable, "primaryName". This is
  // called whenever a user inputs into the fields for a contact's
  // prefix, first, middle, last name, and suffix.
  updatePrimary() {
    let primaryName: string = this.contactsService.getDisplayName(this.getFullName());
    this.contactForm.patchValue({
      primaryName: primaryName
    });
  }
}

