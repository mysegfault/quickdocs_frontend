import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Interns } from '../models/interns.model';

@Injectable({
  providedIn: 'root'
})
export class InternsService {

  backend = `${environment.API_URL}`;

  constructor(private _http: HttpClient) { }


  /** Fonction our ajouter les stagiaires dans la BDD
   * @param  {Interns} internValues
   * @returns Observable
   */
  postIntern(internValues: Interns): Observable<Interns> {
    return this._http.post(`${this.backend}/intern`, internValues)
  }


  /** Fonction our obtenir l'id du stagaire en fonction du code du stagiaire
   * @param  {Interns} codeIntern
   * @returns Observable
   */
  postFindIntern(codeIntern : Interns):  Observable<Interns> {
    return this._http.post(`${this.backend}/interns`, codeIntern)
  }

  
  /** Fonction pour obtenir toutes les infos d'un stagiaire en fonction de son id.
   * @param  {Interns} id
   * @returns Observable
   */
  getOnIntern(id: any): Observable<Interns> {
    return this._http.get(`${this.backend}/intern/` + id)
  }



}
