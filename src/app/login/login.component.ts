import { Component, OnInit } from '@angular/core';
import { AuthService } from  '../auth/auth.service';
import { ReactiveFormsModule , FormsModule, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private authService: AuthService, 
    formsModule: FormsModule, 
    reactiveFormsModule: ReactiveFormsModule,
    private formBuilder: FormBuilder) { }

    ngOnInit() {
      this.loginForm = this.formBuilder.group({
        email: '',
        password: '',
        floatLabel: 'auto'
      })
  
      this.loginForm.valueChanges.subscribe(console.log)
    }

  async login(email: string, password: string) {
    this.authService.login(email, password);
  }
}
