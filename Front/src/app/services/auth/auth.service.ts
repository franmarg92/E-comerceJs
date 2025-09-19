import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Register } from '../../models/registerModel';
import { login } from '../../models/loginModel';
import { loginResponse } from '../../models/loginResponseModel';
import { User } from '../../models/userModel';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://distinzionejoyas.com/api/auth';
  private jwtHelper = new JwtHelperService();

 private authStatusSubject = new BehaviorSubject<boolean>(false);
authStatus$ = this.authStatusSubject.asObservable();

private userSubject = new BehaviorSubject<User | null>(null);
user$ = this.userSubject.asObservable();

setAuthState(user: User): void {
this.userSubject.next(user);
this.authStatusSubject.next(true);
}

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {
    if (this.isBrowser()) {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (storedUser) {
        this.userSubject.next(JSON.parse(storedUser));
      }

      this.authStatusSubject.next(!!token);
    }
  }

  registerUser(userData: Register): Observable<Register> {
    return this.http.post<Register>(`${this.apiUrl}/register`, userData);
  }

  loginUser(userLogin: login): Observable<loginResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<loginResponse>(`${this.apiUrl}/login`, userLogin, { headers })
      .pipe(
        tap((response) => {
          if (response.success && this.isBrowser()) {
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
            localStorage.setItem('role', response.user.role);

            this.userSubject.next(response.user);
            this.authStatusSubject.next(true);
          }
        }),
        catchError((error) => {
          console.error('Error al iniciar sesión:', error);
          return throwError(() => new Error('No se pudo iniciar sesión'));
        })
      );
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    }

    this.userSubject.next(null);
    this.authStatusSubject.next(false);
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser()) return false;
    const token = localStorage.getItem('token');
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  getUserRole(): string | null {
    if (!this.isBrowser()) return null;
    const token = localStorage.getItem('token');
    return token && !this.jwtHelper.isTokenExpired(token)
      ? this.jwtHelper.decodeToken(token).role
      : null;
  }

  getUserName(): string | null {
    return this.userSubject.value?.name || null;
  }

  

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('token');
  }

  isTokenExpired(): boolean {
    if (!this.isBrowser()) return true; // 🚀 Protección SSR

    const token = localStorage.getItem('token');
    if (!token) return true; // si no hay token, está "expirado"

    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);

      return decoded.exp < now;
    } catch (e) {
      return true; // si no se puede decodificar, lo tratamos como inválido
    }
  }

  checkTokenExpiration() {
    if (!this.isBrowser()) return; // 🚀 Protección SSR

    const token = localStorage.getItem('token');

    if (!token) {
      // 🚀 No hay sesión iniciada → no mostramos alerta
      return;
    }else  if (this.isTokenExpired()) {
      Swal.fire({
        icon: 'warning',
        title: 'Sesión expirada',
        text: 'Tu sesión ha caducado, por favor inicia sesión de nuevo.',
        confirmButtonColor: '#4b4944ff',
      }).then(() => {
        this.logout();
      });
    }
  }
}
