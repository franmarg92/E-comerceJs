import { Injectable } from '@angular/core';
import { CanActivate,ActivatedRouteSnapshot , Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['']);
      return false;
    }

    const userRole = this.authService.getUserRole() ?? '';

    const allowedRoles: string[] = route.data['roles'];
    

  if (!allowedRoles || allowedRoles.includes(userRole)) {
    return true;
  }

    console.warn("❌ Acceso denegado: Se requiere rol", allowedRoles);
    this.router.navigate(['']);
    return false;
  }
}
