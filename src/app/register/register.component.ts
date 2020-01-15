import { Component, OnInit } from '@angular/core';
import { AuthService } from  '../auth/auth.service';
import { FormGroup , FormControl } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public errorMessage = "Could not create account";
  public successMessage = "";

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  // tryRegister(value){
  //   this.authService.doRegister(value)
  //   .then(res => {
  //     console.log(res);
  //     this.errorMessage = "";
  //     this.successMessage = "Your account has been created";
  //   }, err => {
  //     console.log(err);
  //     this.errorMessage = err.message;
  //     this.successMessage = "";
  //   })
  // }

  // form = new FormGroup({
  //   name: new FormControl(),
  //   email: new FormControl(),
  //   adresse: new FormGroup({
  //       rue: new FormControl(),
  //       ville: new FormControl(),
  //       cp: new FormControl(),
  //   })
  // });

}
