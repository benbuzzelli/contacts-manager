import { Component, OnInit } from '@angular/core';
import { AuthService } from  '../auth/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from  "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private authService: AuthService, 
    private formBuilder: FormBuilder,
    public router: Router) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: '',
      password: ''
    })

    this.registerForm.valueChanges.subscribe(console.log)
  }

  async register(email: string, password: string) {
    this.authService.register(email, password);
  }

}
