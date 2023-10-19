import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  private URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getClient(
    skip: number,
    limit: number,
    search: string
  ): Observable<any> {
    let urlParams = new URLSearchParams();
    urlParams.append('skip', skip.toString());
    urlParams.append('limit', limit.toString());
    urlParams.append('search', search);
    return this.http.get<any>(`${this.URL}partner?` + urlParams);
  }

  deletePartner(id: string) {
    return this.http.delete(`${this.URL}partner/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Error while deleting a resource ' + error.message);
      })
    );
  }

}
