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
    return this.authService.isLoggedIn;
  }

  logOut() {
    this.authService.sendPasswordResetEmail('benbuzz68@gmail.com');
    this.authService.logout();
  }

}
