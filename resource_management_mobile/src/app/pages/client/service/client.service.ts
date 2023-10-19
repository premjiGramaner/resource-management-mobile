import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private URL = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getClient(skip: number, limit: number, search: string): Observable<any> {
    let urlParams = new URLSearchParams();
    urlParams.append('skip', skip.toString());
    urlParams.append('limit', limit.toString());
    urlParams.append('search', search);
    return this.http.get<any>(`${this.URL}/client?` + urlParams);
  }

  getSkill(): Observable<any> {
    return this.http.get<any>(`${this.URL}/skill`);
  }

  getUser(): Observable<any> {
    return this.http.get<any>(`${this.URL}/user`);
  }

  deleteClient(id: string) {
    return this.http.delete(`${this.URL}/client/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error.message);
        return throwError('Error while deleting a resource ' + error.message);
      })
    );
  }
}
