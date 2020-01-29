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



@Component({
  selector: 'app-view-contacts',
  templateUrl: './view-contacts.component.html',
  styleUrls: ['./view-contacts.component.css']
})
export class ViewContactsComponent implements OnInit {
  contacts$: Observable<any[]> = null;

  /**
   * Setup table with column headers to diplsay contacts
   */
  displayedColumns: string[] = ['fullName', 'deleteButton'];

  constructor(private contactsService: ContactsService,
    public dialog: MatDialog,
    private db: AngularFireDatabase, public router: Router) {
      // Initialise contact$
      this.contacts$ = this.contactsService.contacts$;
  }

  ngOnInit() {
    // Set the users contacts in the template on init.
    this.contacts$ = this.contactsService.getContactsList();
  }

  // See method: setContactsList() in create-contacts/contacts.service.ts
  async setContacts() {
    this.contactsService.setContactsList();
  }

  deleteContact(contact: Contact) {
    let dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe(res => {
      if (res === "yes")
        this.contactsService.deleteContact(contact);
    })

  }

}
