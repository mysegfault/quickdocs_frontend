import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  token!: any;

  constructor(private _route: Router) { }

  ngOnInit() {
    this.token = localStorage.getItem('token');
  }

  // Le logo permet de rediriger vers la page principale
  onRedirectHome() {
    this._route.navigate(['/home'])
  }

  // Méthode qui permet d'afficher un message d'acceuil lorsqu'on est sur /home uniquement
  isHomeRoute(): boolean {
    return this._route.url === '/home';
  }



  /** Cette méthode permet d'aller sur la page des programmes */
  onGoToPdf() {
    this._route.navigate(['/home/programmes'])
  }

  /** Cette méthode permet d'aller sur la page pour ajouter des stagiaires */
  onGoAddIntern() {
    this._route.navigate(['/home/ajouter_stagiaire'])
  }

  /** Cette méthode permet d'aller sur la page pour éditer des documents administratifs */
  onGoEditDoc() {
    this._route.navigate(['/home/documents_stagiaire'])
  }


}
