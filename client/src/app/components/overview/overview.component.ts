import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  user_name!: any;

  constructor(private _route: Router) { }

  ngOnInit() {
    this.user_name = localStorage.getItem('user_name');
  }


  /** Permet de rediriger vers la page des programmes
   */
  onClickToPrograms() {
    this._route.navigate(['/programmes'])
  }


}
