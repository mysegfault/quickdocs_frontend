import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class ConnexionService {

  // backend = `${environment.API_URL}`;
  backend = "http://localhost:3000"

  constructor(private _http: HttpClient) { }

  getConnection(): Observable<any> {
    return this._http.get(`${this.backend}/google`)
  }

}
