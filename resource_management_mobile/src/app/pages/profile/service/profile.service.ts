import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserData } from '../../client/models/client.model';
import { Common } from 'src/app/core/enum/static.enum';
import { addUser, addUserResponse, changePassword, editUser } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getUser(): Observable<UserData> {
    return this.http.get<UserData>(`${this.URL}user`);
  }

  addUser(data: addUser) {
    return this.http.post<addUserResponse>(`${this.URL}user/create`, data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(Common.error_create + 'user' + error.message);
        }));
  }

  editUser(req: editUser) {
    return this.http.put<UserData>(`${this.URL}user/update`, req).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(Common.error_update+'user' + error.message);
      })
    );
  }

  changePassword(req: changePassword) {
    return this.http.put<UserData>(`${this.URL}user/changePassword`, req).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(Common.error_update+'user' + error.message);
      })
    );
  }
}
