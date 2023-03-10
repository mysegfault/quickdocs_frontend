import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Programs } from '../models/programs.model';


@Injectable({
  providedIn: 'root'
})
export class ConnexionService {

  backend = `${environment.API_URL}`;

  constructor(private _http: HttpClient) { }


  /** Cette méthode permet de récupérer tous les titres des programmes.
   * @returns Observable
   */
  getAllLists(): Observable<any> {
    return this._http.get(`${this.backend}/programmes`)
  }

  
  /** cette méthode permet de récupérer toutes les données d'un programme, par la transmission de son id.
   * @param  {any} id
   * @returns Observable
   */
  getOneList(id:any): Observable<Programs> {
    return this._http.get(`${this.backend}/programme/` + id)
  }

}
