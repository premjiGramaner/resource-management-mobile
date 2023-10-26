import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { skillData } from '../../client/models/client.model';

@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  private URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getClient(skip: number, limit: number, search: string): Observable<any> {
    let urlParams = new URLSearchParams();
    urlParams.append('skip', skip.toString());
    urlParams.append('limit', limit.toString());
    urlParams.append('search', search);
    return this.http.get<any>(`${this.URL}partner?` + urlParams);
  }

  postPartner(req: any) {
    return this.http.post(`${this.URL}partner`, req).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Error while posting a data ' + error.message);
      })
    );
  }

  editPartner(req: any) {
    return this.http.put(`${this.URL}partner`, req).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Error while update a data ' + error.message);
      })
    );
  }

  deletePartner(id: string) {
    return this.http.delete(`${this.URL}partner/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Error while deleting a data ' + error.message);
      })
    );
  }

  getSkill(): Observable<skillData> {
    return this.http.get<skillData>(`${this.URL}skill`);
  }
}
