import { Component, OnInit } from '@angular/core';
import { AuthService } from  '../auth/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ContactsService } from '../contacts/contacts.service';
import { Router } from  "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private authService: AuthService, 
    private contactsService: ContactsService,
    private formBuilder: FormBuilder, public router: Router) { }

    ngOnInit() {
      this.loginForm = this.formBuilder.group({
        email: '',
        password: ''
      })
  
      this.loginForm.valueChanges.subscribe(console.log)
    }

  async login(email: string, password: string) {
    this.getItemsList();
    this.authService.login(email, password);
  }

  getItemsList() {
    this.contactsService.getItemsList();
  }

}
