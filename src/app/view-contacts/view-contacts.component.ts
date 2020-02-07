import { Component, OnInit, Input, Inject } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { ContactsService } from '../create-contacts/contacts.service';
import { Observable } from 'rxjs';
import { Router } from  "@angular/router";
import { Contact } from '../create-contacts/contacts.service';
import {MatTableModule} from '@angular/material/table';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-view-contacts',
  templateUrl: './view-contacts.component.html',
  styleUrls: ['./view-contacts.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ViewContactsComponent implements OnInit {
  contacts$: Observable<any[]> = null;
  contactsLength: Number;
  /**
   * Setup table with column headers to diplsay contacts
   */
  displayedColumns: string[] = ['fullName', 'deleteButton', 'editButton'];
  expandedContact: Contact | null;
  hoveredIndex = '-1';
  contactGroups: Array<Group> = [];
  groupsSet = false;

  constructor(private contactsService: ContactsService,
    public dialog: MatDialog,
    private db: AngularFireDatabase, 
    public router: Router,
    private _contactSheet: MatBottomSheet) {
      // Initialise contact$
      this.setContacts('')
  }

  ngOnInit() {
    // Set the users contacts in the template on init.
    this.setContacts('')
  }

  async setContactsLength() {
    this.contacts$.subscribe(result => {this.contactsLength = result.length});
  }

  // See method: setContactsList() in create-contacts/contacts.service.ts
  async setContacts(str: string) {
    str = str.replace(/[^a-zA-Z0-9 ]/g, "");
    let searchAlpha = (str.replace(/[^0-9 ]/g, "").length == 0);
    this.contacts$ = this.contactsService.getSearchResults(str, searchAlpha);
    this.setContactsLength();
  }

  deleteContact(contact: Contact) {
    let dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe(res => {
      if (res === "yes")
        this.contactsService.deleteContact(contact);
    })
  }

  gotToEditContact(contact: Contact) {
    this.contactsService.setStoredContact(contact);
    this.router.navigate(['edit-contact']);
  }

  scroll(id) {
    let el = document.getElementById(id);
    // setTimeout(() => el.scrollIntoView({behavior: 'smooth', block: 'start'}), 1);
  }

  openBottomSheet(contact): void {
    this._contactSheet.open(ContactBottomSheet, {data: contact});
  }

  isDistinctStr(c1, c2) {
    return this.getDistinctStr(c1, c2) !== '';
  }

  getDistinctStr(c1, c2) {
    return this.contactsService.getDistinctStr(c1, c2);
  }

  setIndex(i) {
    this.hoveredIndex = i;
    return true
  }

  check() {
    if (document.getElementById('sticky'))
      console.log(document.getElementById('sticky').style.position)
    return
  }

  setGroups(contacts: Contact[]) {
    if (!this.groupsSet) {
      this.contactGroups = [];
      let l = contacts.length;
      let prevIndex = 0;
      let curGroupStr = '';
      let groupStr = '';
      for (let i = 0; i < l; i++) {
        groupStr = this.getDistinctStr(contacts[i], i===0 ? null : contacts[i-1]);
        if (i === 0)
          curGroupStr = groupStr;
        if (groupStr !== curGroupStr && groupStr != '') {
          if (i-prevIndex === 1)
            this.contactGroups.push(new Group(prevIndex, i, curGroupStr, false, false))
          else {
            this.contactGroups.push(new Group(prevIndex, i-1, curGroupStr, true, false))
            this.contactGroups.push(new Group(i-1, i, curGroupStr, false, true))
          }
          curGroupStr = groupStr;
          prevIndex = i;
          if (i === l-1) {
            this.contactGroups.push(new Group(prevIndex, i+1, curGroupStr, false, false))
          }
        } else if (i === l-1) {
          if (i-prevIndex === 1)
            this.contactGroups.push(new Group(prevIndex, i+1, curGroupStr, false, false))
          else {
            this.contactGroups.push(new Group(prevIndex, i, curGroupStr, true, false))
            this.contactGroups.push(new Group(i, i+1, curGroupStr, false, true))
          }
        }
      }
      this.groupsSet = true;
    }
  }
}

export class Group {
  start: Number;
  end: Number;
  value: string;
  sticky: false;
  transparent: false;
  constructor (s, e, value, sticky, transparent) {
    this.start = s;
    this.end = e;
    this.value = value;
    this.sticky = sticky;
    this.transparent = transparent;
  }
}

@Component({
  selector: 'contact-bottom-sheet',
  styleUrls: ['./view-contacts.component.css'],
  templateUrl: 'contact-bottom-sheet.html',
})
export class ContactBottomSheet {
  contact: Contact;
  constructor(public router: Router,
    private contactsService: ContactsService,
    private _contactSheetRef: MatBottomSheetRef<ContactBottomSheet>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public _contact: any,
    public dialog: MatDialog,) {
      this.contact = _contact;
    }

  openLink(event: MouseEvent): void {
    this._contactSheetRef.dismiss();
    event.preventDefault();
  }

  deleteContact(contact: Contact) {
    let dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe(res => {
      if (res === "yes") {
        this.contactsService.deleteContact(contact);
        this._contactSheetRef.dismiss();
      }
    })
  }

  gotToEditContact(contact: Contact) {
    this._contactSheetRef.dismiss();
    this.contactsService.setStoredContact(contact);
    this.router.navigate(['edit-contact']);
  }
}
