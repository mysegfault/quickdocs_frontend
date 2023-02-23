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

  getAllLists(): Observable<any> {
    return this._http.get(`${this.backend}/programmes`)
  }

  getOneList(id:any): Observable<Programs> {
    return this._http.get(`${this.backend}/programme/` + id)
  }

}
