import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocialUser } from "@abacritt/angularx-social-login";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  backend = `${environment.API_URL}`;

  constructor(private _http: HttpClient) { }


  /** Cette méthode permet de filtrer les utilisateurs Google autorisés en vérifiant leur id google. Si l'id Google renvoyé par SocialUzer (le profil utilisateur google) est compris dans la BDD "users" alors l'utilisateur à accès à l'application.
   * @param  {string} id
   * @param  {SocialUser} user
   * @returns Observable
   */
  postIdGoogle(id: string, user: SocialUser): Observable<any> {
    return this._http.post(`${this.backend}/user/` + id, user);
  }


  /** Cette méthode permet de récupérer le token stocké dans le localstorage pour l'auth.interceptor
 */
  getToken() {
    return localStorage.getItem('token')
  }

}
