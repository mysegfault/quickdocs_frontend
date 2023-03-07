import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  backendUrl = `${environment.API_URL}`;

  constructor(private _authService: AuthService, private _snackBar: MatSnackBar) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    console.log('request auth interceptor', request.url)

    // On récupère le token 
    const token = this._authService.getToken()

    // Si la requete inclus notre adresse backend..
    if (request.url.includes(`${this.backendUrl}`)) {

      // la requete est immuable donc on la clone et on y met le token
      const requestBis = request.clone({
        // On passe dans le headers...
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      })

      // Handle permet de faire la passerelle pour la requete.
      return next.handle(requestBis).pipe(
        // ! Si il y a une erreur : 
        catchError((error: HttpErrorResponse) => {
          let message = ''
          //  On réagit en fonction du statut émis par le serveur ou le client
          switch (error.status) {
            case 400:
              message = "Bad request";
              break;
            case 401:
              message = "Unauthorized";
              break;
            case 403:
              message = "Forbidden";
              break;
            case 500:
              message = "Internal Server Error";
              break;
          }

          // et on affiche dans une snackbar le message d'erreur
          this._snackBar.open(message, 'ok', { verticalPosition: 'top' })

          return next.handle(requestBis)
        }))
    }

    return next.handle(request);
  }
}
