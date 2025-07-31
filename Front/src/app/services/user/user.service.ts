import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/userModel';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient) {}

  editUser(userData: User): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.patch<User>(
      `${this.apiUrl}/edit`,
      
       userData ,
      { headers }
    );
  }

  changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Observable<any> {
    return this.http.patch(`${this.apiUrl}/change-password`, {
      userId,
      oldPassword,
      newPassword,
    });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/`);
  }

  getUserById(id:string): Observable<{user :User}>{
    return this.http.get<{ user: User }>(`${this.apiUrl}/${id}`);
  }

}
