import { Injectable } from '@angular/core';
import { AngularFireAuth } from  "@angular/fire/auth";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { Observable } from 'rxjs';

export class FullName {
  fullName: string;
  prefix: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;

  constructor(prefix: string,
    firstName: string,
    middleName: string,
    lastName: string,
    suffix: string, fullName: string) {
      this.prefix = prefix;
      this.firstName = firstName;
      this.middleName = middleName;
      this.lastName = lastName;
      this.suffix = suffix;
      this.fullName = fullName;
    }
}

export class NameDefaults {

  prefixes: string[] = ["adm","atty","brother","capt","chief","cmdr","col","dean","dr","elder","father","gen","gov",
                        "hon","maj","msgt","mr","mrs","ms","prince", "prof","rabbi","rev","sister"];
  suffixes: string[] = ["ii","iii","iv","cpa","jr","lld","md","phd","ret","rn","sr"];

  getPrefix(prefix: string) {
    let lowprefix = prefix.toLowerCase();
    for (let i = 0; i < this.prefixes.length; i++)
      if (this.prefixes[i] === lowprefix)
        return prefix;
    return "";
  }

  getSuffix(suffix: string) {
    let lowsuffix = suffix.toLowerCase();
    for (let i = 0; i < this.suffixes.length; i++)
      if (this.suffixes[i] === lowsuffix)
        return suffix;
    return "";
  }

  getNames(names: string[]) {
    let length = names.length;
    if (names[length-1] === "")
      length--;
    let prefix: string;
    let firstName: string;
    let middleName: string;
    let lastName: string;
    let suffix: string;

    let assigned: boolean[] = [];

    for (let i = 0; i < names.length; i++)
      assigned[i] = false;

    let firstIndex = 0;

    prefix = this.getPrefix(names[0]);
    
    assigned[0] = prefix != "";
    
    if (length > 2)
      suffix = this.getSuffix(names[length-1]);
    else
      suffix = "";

    assigned[length-1] = suffix != "";

    if (length > 1) {
      let lastNameIndex = assigned[length-1] ? length-2 : length-1;
      lastName = names[lastNameIndex];
      assigned[lastNameIndex--] = true;
    } else
      lastName = "";

    let numUnassigned = 0;
    for (let i = 0; i < length; i++)
      if (!assigned[i]) 
        numUnassigned++;

    if (numUnassigned > 1) {
      let index = length-1;
      while (assigned[index])
        index--;
      middleName = names[index];
      assigned[index] = true;
    } else
      middleName = "";

    let index = 0;
    while (assigned[index])
      index++;

    firstName = "";
    let firstNames: string[] = [];
    let count = 0;
    for (let i = 0; i < length; i++) {
      if (!assigned[i]) {
        firstNames[count] = names[i];
        count++;
      }
    }

    firstName = firstNames.join(" ");

    let fullNameArray: Array<string> = new Array();
    if (prefix != "") fullNameArray.push(prefix);
    if (firstName != "") fullNameArray.push(firstName);
    if (middleName != "") fullNameArray.push(middleName);
    if (lastName != "") fullNameArray.push(lastName);
    if (suffix != "") fullNameArray.push(suffix);

    let fullName = fullNameArray.join(" ");

    return new FullName(prefix, firstName, middleName, lastName, suffix, fullName);
  }

  getFullName(fullName: FullName) {
    let fullNameArray: Array<string> = new Array();
    if (fullName.prefix != "") fullNameArray.push(fullName.prefix);
    if (fullName.firstName != "") fullNameArray.push(fullName.firstName);
    if (fullName.middleName != "") fullNameArray.push(fullName.middleName);
    if (fullName.lastName != "") fullNameArray.push(fullName.lastName);
    if (fullName.suffix != "") fullNameArray.push(fullName.suffix);

    return fullNameArray.join(" ");
  }

}

export class Contact {
  fullName: string
  phone: string;
  email: string;

  constructor(fullName: string, phone: string, email: string) {
    this.fullName = fullName;
    this.phone = phone;
    this.email = email;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  contacts$: Observable<any[]> = null;
  userId: string;

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      if(user) this.userId = user.uid
    })
  }

  getItemsList(): Observable<any[]> {
    if (!this.userId) return;
    this.contacts$ = this.db.list(`contacts/${this.userId}`).valueChanges();
    this.db.list(`contacts/${this.userId}`).valueChanges().subscribe(console.log);
    return this.contacts$;
  }


  createItem(contact: Contact)  {
    this.getItemsList();
    this.db.list(`contacts/${this.userId}`).push(contact);
  }

  getNameValues(primary: string) {
    let names: string[] = primary.split(" ");
    let nd: NameDefaults = new NameDefaults();
    return nd.getNames(names);
  }

  getFullName(fullName: FullName) {
    let nd: NameDefaults = new NameDefaults();
    return nd.getFullName(fullName);
  }
}
