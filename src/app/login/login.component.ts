import { Component, OnInit } from '@angular/core';
import { AuthService } from  '../auth/auth.service';
import { ReactiveFormsModule , FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private formsModule: FormsModule) { }

  ngOnInit() {
  }

  async login(email: string, password: string) {
    this.authService.login(email, password);
  }

}
