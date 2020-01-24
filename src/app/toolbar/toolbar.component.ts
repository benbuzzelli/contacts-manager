import { Component, OnInit } from '@angular/core';
import { AuthService } from  '../auth/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
    
  }

  isLoggedIn() {
    let user = localStorage.getItem('user');
    return user !== "null" && typeof user !== 'undefined' && user !== null;
  }

  logOut() {
    this.authService.sendPasswordResetEmail('benbuzz68@gmail.com');
    this.authService.logout();
  }

}
