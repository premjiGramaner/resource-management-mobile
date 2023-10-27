import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { hiringResponse } from '../model/hiring.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HiringService {

  private URL = environment.baseUrl;

  constructor(private http: HttpClient) { }
  getHirings(skip: number, limit: number, search: string): Observable<any> {
    let urlParams = new URLSearchParams();
    urlParams.append('skip', skip.toString());
    urlParams.append('limit', limit.toString());
    urlParams.append('search', search);

    return this.http.get<hiringResponse>(`${this.URL}resource/hiring?` + urlParams,);
  }

  getHiringAllData() {
    return this.http.get<hiringResponse>(`${this.URL}resource/hiring`);
  }

  deleteHiring(id: number) {
    return this.http.delete(`${this.URL}resource/hiring/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError("Error while deleting a hiring " + error.message);
      }));
  }
}
