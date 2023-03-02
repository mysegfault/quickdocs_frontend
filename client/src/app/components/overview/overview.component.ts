import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  // user_name!: any;
  token!: any;

  constructor(private _route: Router) { }

  ngOnInit() {
    
    // this.user_name = localStorage.getItem('user_name');
    this.token = localStorage.getItem('token');

  }

    // Le logo permet de rediriger vers la page principale
    onRedirectHome() {
      this._route.navigate(['/home'])
    }



}
