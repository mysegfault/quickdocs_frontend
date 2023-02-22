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
  showWelcome: boolean = true;

  constructor(private _route: Router, private _authService: SocialAuthService) { }

  ngOnInit() {
    
    this.user_name = localStorage.getItem('user_name');
    const token = localStorage.getItem('token');

    if (this._route.url === '/home/programmes') {
      this.showWelcome = false;
    }

  }


  /** Pour se déconnecter
   */
  onLogOut() {
    this._authService.signOut();
    localStorage.clear();
    this._route.navigate(['/login']);
  }


  onClickBtn() {
    this.showWelcome = false;
  }


}
