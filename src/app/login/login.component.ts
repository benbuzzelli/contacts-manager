import { Component, OnInit } from '@angular/core';
import { AuthService } from  '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // username: string;
  // password: string; 

  constructor(private  authService:  AuthService) { }

  ngOnInit() {
  }

  async login(email: string, password: string) {
    console.log(email + "\npass = " + password);
    this.authService.login(email, password);
  }

}
