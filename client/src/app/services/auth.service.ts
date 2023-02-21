import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { Users } from 'src/app/models/users.model';
import { SocialUser } from "@abacritt/angularx-social-login";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  backend = `${environment.API_URL}`;

  constructor(private _http: HttpClient) { }

  postIdGoogle(id: string, user: SocialUser): Observable<any> {
    return this._http.post(`${this.backend}/user/`+ id, user);
  }

    /** Cette méthode permet de récupérer le token stocké dans le localstorage pour l'auth.interceptor
   */
    getToken() {
      return localStorage.getItem('token')
    }
}
