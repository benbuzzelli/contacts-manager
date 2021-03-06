import { Component, OnInit, Inject } from '@angular/core';
import { ContactsService, Contact } from '../create-contacts/contacts.service';
import { FullName } from '../names/names.service';
import { AngularFireDatabase } from "@angular/fire/database";
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Router } from  "@angular/router";
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { SaveChangesDialogComponent } from '../save-changes-dialog/save-changes-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactFormService } from '../contact-form/contact-form.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContactDialog } from '../view-contacts/view-contacts.component';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css']
})
export class EditContactComponent implements OnInit {
  contactForm: FormGroup;
  contact: Contact; 

  constructor(private contactsService: ContactsService, 
    private db: AngularFireDatabase,
    private formBuilder: FormBuilder, 
    public router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private contactFormService: ContactFormService,
    @Inject(MAT_DIALOG_DATA) public _contact: any,
    private _editContactDialogRef: MatDialogRef<EditContactComponent>) {

    this.contact = _contact;
    this.initContactForm();
  }

  ngOnInit() { }

  initContactForm() {
    this.contactForm = this.formBuilder.group({
      primaryName: '',
      prefix: '',
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      emails: this.formBuilder.array([]),
      phoneNumbers: this.formBuilder.array([])
    })
    this.setContactFormToSelectedContact();
  }

  setContactFormToSelectedContact() {
    let contact = this.contact;

    this.contactForm.patchValue({
      primaryName: contact.fullName.fullName,
      prefix: contact.fullName.prefix,
      firstName: contact.fullName.firstName,
      middleName: contact.fullName.middleName,
      lastName: contact.fullName.lastName,
      suffix: contact.fullName.suffix
    })

    this.patchPhoneAndEmails('phoneNumbers', contact);
    this.patchPhoneAndEmails('emails', contact);
  }

  patchPhoneAndEmails(kind: string, contact: Contact) {
    let l = contact[kind].length;
    let array = this.contactForm.get(kind) as FormArray;
    let type = kind === 'emails' ? 'emailTypes' : 'phoneTypes';
    for (let i = 0; i < l; i++) {
      let num = contact[kind][i];
      array.push(this.createPhoneOrEmail(num.type, num.value, array.length));
    }
    this.contactFormService.handlePhoneAndEmailArrays('', array, type)
  }

  // Returns a new FormGroup instance for phone numbers
  createPhoneOrEmail(type: string, value: string, length: number): FormGroup {
    return this.formBuilder.group({
      type: type,
      value: value,
      index: length,
      canRemove: false
    });
  }

  openContactCreatedSnackBar(action: string) {
    let message = this.contactForm.get('primaryName').value;
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  getContactFromForm(id) {
    // Retrieves the raw data values of phoneNumbers and emails from contactForm,
    // and stores them into two separate arrays.
    let phoneNumbers: any[] = (this.contactForm.get('phoneNumbers') as FormArray).getRawValue();
    let emails: any[] = (this.contactForm.get('emails') as FormArray).getRawValue();

    // Removes the last element from phoneNumbers and emails if
    // they are "empty".
    if (phoneNumbers[phoneNumbers.length-1].value === "")
      phoneNumbers.pop();
    if (emails[emails.length-1].value === "")
      emails.pop();

    let contact = new Contact(this.getFullName(), phoneNumbers, emails);
    contact.id = id;
    return contact;
  }

  // Creates a new contact with the input values from contactForm
  editContact(id) {
    let contact = this.getContactFromForm(id);
    this.contactsService.editContact(contact);
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


  // Checks all formGroup values to see if the form is filled
  formIsChanged(): boolean {
    if (this.contactForm != undefined || this.contactForm != null) {
      let emails: FormArray = this.contactForm.get('emails') as FormArray;
      let phoneNumbers: FormArray = this.contactForm.get('phoneNumbers') as FormArray;

      if (this.contactForm.get('primaryName').value !== this.contact.fullName.fullName)
        return true;

      if (this.contact.phoneNumbers.length != (phoneNumbers.length-1) || this.contact.emails.length != (emails.length-1))
        return true;

      for (let i = 0; i < emails.length; i++)
        if (this.contact.emails[i] !== undefined && emails.get(i.toString()).get('value').value !== this.contact.emails[i].value)
          return true;

      for (let i = 0; i < phoneNumbers.length; i++)
        if (this.contact.phoneNumbers[i] !== undefined && phoneNumbers.get(i.toString()).get('value').value !== this.contact.phoneNumbers[i].value)
          return true;

      return false
    }
  }

  // Opens the edit dialog to give a user the option to either discard their changes,
  // or keep creating the new contact.
  openEditDialog() {
    if (!this.formIsChanged()) {
      this._editContactDialogRef.close('back to contact');
      return;
    }

    let dialogRef = this.dialog.open(EditDialogComponent);

    dialogRef.afterClosed().subscribe(res => {
      if (res === "discard") {
        this._editContactDialogRef.close('back to contact');
      } else {
        document.getElementById('backspaceButton').blur();
      }
    })
  }

  openSaveChangesDialog() {
    if (!this.formIsChanged()) {
      this._editContactDialogRef.close();
      return;
    }

    let dialogRef = this.dialog.open(SaveChangesDialogComponent);

    dialogRef.afterClosed().subscribe(res => {
      if (res === "save") {
        // this.createContact(this.contact.id);
        this.openContactCreatedSnackBar('edited!');
        this.editContact(this.contact.id)
        this._editContactDialogRef.close('save');
      } else {
        document.getElementById('saveButton').blur();
      }
    })
  }
}
