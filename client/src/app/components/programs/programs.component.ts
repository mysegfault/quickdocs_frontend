import { Component, OnInit } from '@angular/core';
import { ConnexionService } from 'src/app/services/connexion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit {

  allList!: any[];
  showList: boolean = true;

  constructor( private _programServ: ConnexionService, private _route: Router) { }
 
  ngOnInit() {

    this._programServ.getAllLists().subscribe((listsFromBackend: any[])=>{
      console.log(listsFromBackend);
      this.allList = listsFromBackend;
    })

    if (this._route.url === '/programmes/programme_pdf') {
      this.showList = false;
    }

  }

  
  /** Cette méthode est situé sur le bouton du router "ouvrir" et elle permet de ne plus afficher la liste des programmes */
  onOpenProgram(i: number) {

    this.showList = false;
    // On ajuste l'index à +2 car : +1 pour les index de tableau quiccommence à 0 a lors que la feuille de calcul commence à 1 et +1 car la première lignes de cette feuille de calcul commence par les titres.
    const idList = i+2;
    console.log(idList);
    const programID = JSON.stringify(idList)
    // On stocke l'id dans le localstorage pour le récupérer pour la page programme_pdf
    localStorage.setItem('iprogramID', programID)

  }


  /** Cette méthode permet de revenir à la page d'avant (home)*/
  onGoBack() {

    this._route.navigate(['/programmes'])
    this.showList = true;

  }


  onRedirectHome() {

    this._route.navigate(['/home'])

  }

}
