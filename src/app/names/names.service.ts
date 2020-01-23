import { Injectable } from '@angular/core';

export class FullName {
  fullName: string;
  prefix: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;

  constructor(fullName: string, prefix: string,
    firstName: string,
    middleName: string,
    lastName: string,
    suffix: string) {
      this.fullName = fullName;
      this.prefix = prefix;
      this.firstName = firstName;
      this.middleName = middleName;
      this.lastName = lastName;
      this.suffix = suffix;
    }
}

@Injectable({
  providedIn: 'root'
})

// This service is for the add contacts page and/or the edit contacts page.
// It contains a method called getNames() which returns an instance of
// FullName. The getNames(string[]) method is called in ContactService
// in the method, getNameValues(string). This is called whenever a user
// inputs into the add contacts name field.
export class NamesService {

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

  getNames(primary: string) {
    let names: string[] = primary.split(/\s+/);
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
    console.log("primary length = " + length);
    if (length > 2) {
      suffix = this.getSuffix(names[length-1]);
      assigned[length-1] = suffix != "";
    } else
      suffix = "";

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
    return new FullName(primary, prefix, firstName, middleName, lastName, suffix);
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
