import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  user_name!: any;
  token!: any;

  constructor(private _route: Router, private _authService: SocialAuthService) { }

  ngOnInit() {
    
    this.user_name = localStorage.getItem('user_name');
    this.token = localStorage.getItem('token');

  }


  /** Méthode pour se déconnecter */
  onLogOut() {

    // A chaque sign out, on refresh le token.
    this._authService.signOut();
    localStorage.clear();
    this._route.navigate(['/login']);

  }

 /** Cette méthode permet de diriger vers la liste des programmes */
  onClickBtn() {

    this._route.navigate(['/programmes'])
    
  }


}
