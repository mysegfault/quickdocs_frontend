import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private _authService: AuthService, private _snackBar: MatSnackBar, private _router: Router) {}


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
     
      // On récupère le token pour avoir accès aux autres pages.
      const token = this._authService.getToken()
      if (token) {
        return true;  //  donne accès
      } else {
        this._snackBar.open('Vous n\'avez pas accès à la page', 'ok')
        return this._router.navigate(['/home']) // retourne à l'overview'
      }

  }
  
}
