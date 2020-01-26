import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';

import { ReactiveFormsModule , FormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

import { RouterModule, Routes } from '@angular/router';
import { LocationStrategy, HashLocationStrategy} from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { MatIconModule } from '@angular/material/icon';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ViewContactsComponent } from './view-contacts/view-contacts.component';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';

import { AuthGuard } from './auth/auth.guard';

const appRoutes: Routes = [
  { path:  'login',component:  LoginComponent},
  { path:  'register', component:  RegisterComponent },
  { path:  'forgot-password', component:  ForgotPasswordComponent },
  { path:  'verify-email', component:  VerifyEmailComponent },
  { path:  'contacts',component:  ContactsComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    ToolbarComponent,
    ContactsComponent,
    ViewContactsComponent,
    EditDialogComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    ),
    BrowserModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MaterialModule,
    MatIconModule,
    AppRoutingModule
  ],
  entryComponents: [EditDialogComponent],
  providers: [AuthGuard, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
