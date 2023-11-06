import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { addHiringData, deleteHiringResponce, hiringHistoryResponse, hiringResponse, updateHiringStatus } from '../model/hiring.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { resourceResponse } from '../../resource/models/resource.model';

@Injectable({
  providedIn: 'root'
})
export class HiringService {

  private URL = environment.baseUrl;

  constructor(private http: HttpClient) { }
  getHirings(skip: number, limit: number, search: string): Observable<hiringResponse> {
    let urlParams = new URLSearchParams();
    urlParams.append('skip', skip.toString());
    urlParams.append('limit', limit.toString());
    urlParams.append('search', search);

    return this.http.get<hiringResponse>(`${this.URL}resource/hiring?` + urlParams,);
  }

  getHiringAllData() {
    return this.http.get<hiringResponse>(`${this.URL}resource/hiring`);
  }

  getHiringHistoryData(id:number) {
    return this.http.get<hiringHistoryResponse>(`${this.URL}resource/hiring/history/${id}`);
  }

  deleteHiring(id: number) {
    return this.http.delete<deleteHiringResponce>(`${this.URL}resource/hiring/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError("Error while deleting a hiring " + error.message);
      }));
  }

  addHiring(data: addHiringData) {
    return this.http.post<hiringResponse>(`${this.URL}resource/hiring`, data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError("Error while creating a hiring" + error.message);
        }));
  }


  updateHiring(data: addHiringData): Observable<hiringResponse> {
    return this.http.put<hiringResponse>(`${this.URL}resource/hiring`, data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // this.errorHandler.log("Error while updating a todo", error);
          return throwError("Error while updating a hiring " + error.message);
        }));
  }

  updateHiringStatus(data: updateHiringStatus): Observable<hiringResponse> {
    return this.http.put<hiringResponse>(`${this.URL}resource/hiring/status`, data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // this.errorHandler.log("Error while updating a todo", error);
          return throwError("Error while updating a hiring status" + error.message);
        }));
  }
}
