import { Component, OnInit } from '@angular/core';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {


  constructor(private _route: Router, private _authService: SocialAuthService) { }

  ngOnInit() {}


    /** Méthode pour se déconnecter */
    onLogOut() {

      // A chaque sign out, on refresh le token.
      this._authService.signOut();
      localStorage.clear();
      this._route.navigate(['/login']);
  
    }
}
