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

  constructor( private _programServ: ConnexionService, private _route: Router ) { }
 
  ngOnInit() {

    this._programServ.getAllLists().subscribe((listsFromBackend: any[])=>{
      console.log(listsFromBackend);
      this.allList = listsFromBackend
    })

    if (this._route.url === '/programmes/programme_pdf') {
      this.showList = false;
    }

  }

  
  /** Cette méthode est situé sur le bouton du router "ouvrir" et elle permet de ne plus afficher la liste des programmes */
  onClickBtn() {

    this.showList = false;

  }


  /** Cette méthode permet de revenir à la page d'avant (home)*/
  onGoBack() {

    this._route.navigate(['/programmes'])

  }


  onRedirectHome() {

    this._route.navigate(['/home'])

  }

}
