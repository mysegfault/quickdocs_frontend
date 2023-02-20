import { Component, OnInit } from '@angular/core';
import { SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user!: SocialUser;
  loggedIn!: boolean;
  private _accessToken!: string;
  name!: string;


  constructor(private _authService: SocialAuthService) { }
  
  /** Au chargement de la page on va lancer la possibilité de s'authentifier avec google en faisant appel à authService (et à la méthode authState) qui est livré avec le package @abacritt/angularx-social-login qu'on a configurer dans app.module.
   */
  ngOnInit() {
    this._authService.authState.subscribe((user) => {
      this.user = user;
      console.log(this.user);
      this._accessToken = this.user.idToken;
      this.name = this.user.name
      this.loggedIn = (user != null);
    });
  }
  
  

}




  // private _connexion: ConnexionService

  /** Cette méthode renvoie vers une route du backend (/google) qui permet de s'authentifier avec notre compte google.
   * Elle se déclenche au clic sur le bouton de la page.
   */
  // onLogin () {

  //   this._connexion.getConnection().subscribe((response: any) => {
  //     console.log('response ' + response)    
  //   })
  // }
