import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Register } from '../../models/registerModel';
import { login } from '../../models/loginModel';
import { loginResponse } from '../../models/loginResponseModel';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://distinzionejoyas.com/api/auth';
  private jwtHelper = new JwtHelperService();
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {
    if (this.isBrowser()) {
         const storedUser = localStorage.getItem('user');
  if (storedUser) {
    this.userSubject.next(JSON.parse(storedUser)); 
  }
    }
  }
    private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

   private authStatus = new BehaviorSubject<boolean>(
  typeof window !== 'undefined' && !!localStorage.getItem('token')
);
  authStatus$ = this.authStatus.asObservable();



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
            this.authStatus.next(true);
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
    this.authStatus.next(false);
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

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('token');
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
