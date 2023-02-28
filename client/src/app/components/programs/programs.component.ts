import { Component, OnInit } from '@angular/core';
import { ConnexionService } from 'src/app/services/connexion.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit {

  allList!: any[];
  // showList: boolean = true;

  constructor( private _programServ: ConnexionService, private _route: Router, private _authService: SocialAuthService) { }
 
  ngOnInit() {

    // On récupère les titres de chaques programmes
    this._programServ.getAllLists().subscribe((listsFromBackend: any[])=>{
      console.log(listsFromBackend);
      this.allList = listsFromBackend;
    })

  }

  
  /** Cette méthode est situé sur le bouton du router "ouvrir" et elle permet de ne plus afficher la liste des programmes */
  onOpenProgram(i: number) {

    // On ajuste l'index à +2 car : +1 pour les index de tableau quiccommence à 0 a lors que la feuille de calcul commence à 1 et +1 car la première lignes de cette feuille de calcul commence par les titres.
    const idList = i+2;
    console.log(idList);
    const programID = JSON.stringify(idList)

    // On stocke l'id dans le localstorage pour le récupérer pour la page programme_pdf
    localStorage.setItem('iprogramID', programID)
    // Puis on redirige vers la page du programmes à imprimer
    this._route.navigate(['/programme_pdf'])
    
  }
  

  // Le logo permet de rediriger vers la page principale
  onRedirectHome() {
    this._route.navigate(['/home'])
  }


    /** Méthode pour se déconnecter */
    onLogOut() {

      this._authService.signOut();
      localStorage.clear();
      this._route.navigate(['/login']);
  
    }

}
