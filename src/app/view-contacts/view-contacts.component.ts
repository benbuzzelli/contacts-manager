import { Component, OnInit } from '@angular/core';
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

  /**
   * Setup table with column headers to diplsay contacts
   */
  displayedColumns: string[] = ['fullName', 'deleteButton', 'editButton'];
  expandedContact: Contact | null;

  constructor(private contactsService: ContactsService,
    public dialog: MatDialog,
    private db: AngularFireDatabase, public router: Router) {
      // Initialise contact$
      this.setContacts('')
  }

  ngOnInit() {
    // Set the users contacts in the template on init.
    this.setContacts('')
  }

  // See method: setContactsList() in create-contacts/contacts.service.ts
  async setContacts(str: string) {
    str = str.replace(/[^a-zA-Z0-9 ]/g, "");
    let searchAlpha = (str.replace(/[^0-9 ]/g, "").length == 0);
    this.contacts$ = this.contactsService.getSearchResults(str, searchAlpha);
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

  scrollTo($event) {
    if ($event) {
      console.log("Yay")
      $event.target.scrollTo();
      // $event.target.scrollIntoView();
    }
  }

  scroll(id) {
    let el = document.getElementById(id);
    setTimeout(() => el.scrollIntoView({behavior: 'smooth', block: 'start'}), 1);
  }

  step = -1;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}
