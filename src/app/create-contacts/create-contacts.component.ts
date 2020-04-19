import { Component, OnInit } from '@angular/core';
import { ContactsService, Contact } from './contacts.service';
import { FullName } from '../names/names.service';
import { AngularFireDatabase } from "@angular/fire/database";
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Router } from  "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactFormService } from '../contact-form/contact-form.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './create-contacts.component.html',
  styleUrls: ['./create-contacts.component.css']
})
export class ContactsComponent implements OnInit {
  contactForm: FormGroup;

  constructor(private contactsService: ContactsService, 
    private db: AngularFireDatabase,
    private formBuilder: FormBuilder, 
    public router: Router,
    public dialog: MatDialog,
    private _createdContactSnackBar: MatSnackBar,
    private contactFormService: ContactFormService) {
    this.initContactForm();
  }

  ngOnInit() { 
    // this.initContactForm();
  }

  initContactForm() {
    this.contactForm = this.contactFormService.initialiseForm();
    let phoneNumbers = this.contactForm.get('phoneNumbers') as FormArray;
    this.contactFormService.addPhoneOrEmail(phoneNumbers, this.contactFormService.phoneTypeString);
    let emails = this.contactForm.get('emails') as FormArray;
    this.contactFormService.addPhoneOrEmail(emails, this.contactFormService.emailTypeString);
  }

  openContactCreatedSnackBar(action: string) {
    let message = this.contactForm.get('primaryName').value;
    let name = this.contactsService.contactNameJustCreated;
    if (name != undefined && name != null)
      message = name
    this._createdContactSnackBar.open(message, action, {
      duration: 2000,
    });
  }

  // Creates a new contact with the input values from contactForm
  createContact() {
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

    this.contactsService.createContact(new Contact(this.getFullName(), phoneNumbers, emails));
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
  formIsFilled(): boolean {
    if (this.contactForm != undefined || this.contactForm != null) {
      let emails: FormArray = this.contactForm.get('emails') as FormArray;
      let phoneNumbers: FormArray = this.contactForm.get('phoneNumbers') as FormArray;

      if (this.contactForm.get('primaryName').value != "")
        return true;

      for (let i = 0; i < emails.length; i++)
        if (emails.get(i.toString()).get('value').value != "")
          return true;

      for (let i = 0; i < phoneNumbers.length; i++)
        if (phoneNumbers.get(i.toString()).get('value').value != "")
          return true;

      return false
    }
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
      else {
        document.getElementById('backButton').blur();
      }
    })
  }
}
