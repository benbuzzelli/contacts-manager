import { Injectable, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

export class ContactType {
  value: string;
  viewValue: string;
  inUse: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ContactFormService {

  phoneTypeString: string = 'phoneTypes';
  emailTypeString: string = 'emailTypes';

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

  constructor(private formBuilder: FormBuilder) { }

  initialisePhoneAndEmailTypes() {
    for (let i = 0; i < this.phoneTypes.length; i++)
      this.phoneTypes[i].inUse = false;
    for (let i = 0; i < this.emailTypes.length; i++)
      this.emailTypes[i].inUse = false;
  }

  // Adds a new phone number input field into the template
  addPhoneOrEmail(formArray: FormArray, type: string): void {
    formArray.push(this.createPhoneOrEmail(formArray.length, type));
  }

  // Adds a new email input field into the template
  addEmail(emails: FormArray): void {
    emails.push(this.createEmail(emails.length));
  }

  // Returns a new FormGroup instance for phone numbers
  createPhoneOrEmail(length: number, type: string): FormGroup {
    return this.formBuilder.group({
      type: type === 'phoneTypes' ? this.getDefaultedPhoneType() : this.getDefaultedEmailType(),
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
  getDefaultedPhoneType(): string {
    for (let i = 0; i < this.phoneTypes.length; i++) {
      if (!this.phoneTypes[i].inUse)
        return this.phoneTypes[i].viewValue;
    }
    return this.phoneTypes[this.phoneTypes.length-1].viewValue;
  }

  // Returns the type of email to be displayed, based on which
  // types are currently in use.
  getDefaultedEmailType(): string {
    for (let i = 0; i < this.emailTypes.length; i++) {
      if (!this.emailTypes[i].inUse)
        return this.emailTypes[i].viewValue;
    }
    return this.emailTypes[this.emailTypes.length-1].viewValue;
  }

  // Loops through the phone number and email types
  // and sets their inUse value to true if they are equal
  // to the contactForm phone number or email type.
  setTypesInUse(formArray: FormArray, type: string) {
    for (let j = 0; j < this[type].length; j++) {
      this[type][j].inUse = false;
    }

    for (let i = 0; i < formArray.length; i++) {
      for (let j = 0; j < this[type].length; j++) {
        if (formArray.get(i.toString()).get('type').value === this[type][j].viewValue)
        this[type][j].inUse = true;
      }
    }
  }

  // Removes or adds a new phone number or Email input field whether or not
  // there is no empty input field.
  handlePhoneAndEmailArrays(value: string, formArray: FormArray, type: string) {
    let length: number = (formArray.length);

    let empty: number = 0;
    for (let i = 0; i < length; i++)
      if (formArray.get(i.toString()).get('value').value === "")
        empty++;
    
    if (empty > 1) {
      let val: number = empty;
      let index: number = length-1;
      while (val > 1 && index >= 0) {
        if (formArray.get(index.toString()).get('value').value === "") {
          val--;
          formArray.removeAt(index);
        }
        index--;
      }
    } else if (empty == 0) {
      this.setTypesInUse(formArray, type);
      this.addPhoneOrEmail(formArray, type);
    }
  }
}
