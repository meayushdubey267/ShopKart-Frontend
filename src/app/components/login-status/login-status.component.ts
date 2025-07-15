
import {DOCUMENT} from '@angular/common';
import {Component, Inject} from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent {
  isAuthenticated: boolean = false;
  menuOpen: boolean = false;
  profileJson:String | undefined;
  userEmail: string | undefined;
  storage: Storage = sessionStorage; 
  constructor(private auth:AuthService,@Inject(DOCUMENT) private doc: Document) {}
  ngOnInit():void {
    this.auth.isAuthenticated$.subscribe(
      (isAuthenticated:boolean) => {
        this.isAuthenticated = isAuthenticated;
        console.log('isAuthenticated:', this.isAuthenticated);
      }
    );
    this.auth.user$.subscribe(
      (user) => {
          this.userEmail = user?.email;
          this.storage.setItem('userEmail', JSON.stringify(this.userEmail));
          console.log('userEmail:', this.userEmail);      
      }
    );
  }
  login(){
    this.auth.loginWithRedirect();
  }
  logout(): void {
    this.auth.logout({ logoutParams: {returnTo: this.doc.location.origin} });
  }

}