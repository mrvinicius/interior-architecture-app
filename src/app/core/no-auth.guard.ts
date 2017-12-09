import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';

@Injectable()
export class NoAuthGuard implements CanActivate {
  public static readonly noAuthUrls = [
    '/',
    '/entrar',
    '/cadastro',
    '/quase-la',
    '/recuperar',
    '/senha',
    '/profissao'
  ]

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let url: string = state.url;


    if (localStorage.getItem('currentUser')) {
      if (NoAuthGuard.noAuthUrls.includes(url)) {
        this.router.navigate(['/orcamentos']);
        return false;
      }
    }

    return true;
  }
}
