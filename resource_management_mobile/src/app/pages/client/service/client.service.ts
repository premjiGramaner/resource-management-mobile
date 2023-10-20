import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  UserData,
  clientData,
  clientResponce,
  skillData,
} from '../models/client.model';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private URL = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getClient(
    skip: number,
    limit: number,
    search: string
  ): Observable<clientResponce> {
    let urlParams = new URLSearchParams();
    urlParams.append('skip', skip.toString());
    urlParams.append('limit', limit.toString());
    urlParams.append('search', search);
    return this.http.get<clientResponce>(`${this.URL}client?` + urlParams);
  }

  getClientAllData() {
    return this.http.get<clientResponce>(`${this.URL}client`);
  }

  getSkill(): Observable<skillData> {
    return this.http.get<skillData>(`${this.URL}skill`);
  }

  getUser(): Observable<UserData> {
    return this.http.get<UserData>(`${this.URL}user`);
  }

  deleteClient(id: string) {
    return this.http.delete(`${this.URL}client/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Error while deleting a resource ' + error.message);
      })
    );
  }

  postClient(req: clientData): Observable<clientResponce> {
    return this.http.post<clientResponce>(`${this.URL}client`, req);
  }

  editClient(req: clientData): Observable<clientResponce> {
    return this.http.put<clientResponce>(`${this.URL}client`, req);
  }
}
