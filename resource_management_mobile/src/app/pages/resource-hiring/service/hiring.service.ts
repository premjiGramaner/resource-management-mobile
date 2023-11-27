import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { addHiringData, deleteHiringResponce, hiringHistoryResponse, hiringResponse, updateHiringStatus } from '../model/hiring.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Common, Modules } from 'src/app/core/enum/static.enum';

@Injectable({
  providedIn: 'root'
})
export class HiringService {

  private URL = environment.baseUrl;

  constructor(private http: HttpClient) { }
  getHirings(skip: number, limit: number, search: string): Observable<hiringResponse> {
    let urlParams = new URLSearchParams();
    urlParams.append(Common.skip, skip.toString());
    urlParams.append(Common.limit, limit.toString());
    urlParams.append(Common.search, search);

    return this.http.get<hiringResponse>(`${this.URL}${Modules.Resource.toLowerCase()}/${Modules.Hiring.toLowerCase()}?` + urlParams,);
  }

  getHiringAllData() {
    return this.http.get<hiringResponse>(`${this.URL}${Modules.Resource.toLowerCase()}/${Modules.Hiring.toLowerCase()}`);
  }

  getHiringAdminData(skip: number, limit: number, search: string): Observable<hiringResponse> {
    let urlParams = new URLSearchParams();
    urlParams.append(Common.skip, skip.toString());
    urlParams.append(Common.limit, limit.toString());
    urlParams.append(Common.search, search);
    return this.http.get<hiringResponse>(`${this.URL}${Modules.Resource.toLowerCase()}/${Modules.Hiring.toLowerCase()}/${Modules.Admin.toLowerCase()}?`+urlParams);
  }

  getHiringHistoryData(id:number) {
    return this.http.get<hiringHistoryResponse>(`${this.URL}${Modules.Resource.toLowerCase()}/${Modules.Hiring.toLowerCase()}/${Modules.History.toLowerCase()}/${id}`);
  }

  deleteHiring(id: number) {
    return this.http.delete<deleteHiringResponce>(`${this.URL}${Modules.Resource.toLowerCase()}/${Modules.Hiring.toLowerCase()}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(Common.error_delete + Modules.Hiring.toLowerCase() + error.message);
      }));
  }

  addHiring(data: addHiringData) {
    return this.http.post<hiringResponse>(`${this.URL}${Modules.Resource.toLowerCase()}/${Modules.Hiring.toLowerCase()}`, data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(Common.error_create + Modules.Hiring.toLowerCase() + error.message);
        }));
  }


  updateHiring(data: addHiringData): Observable<hiringResponse> {
    return this.http.put<hiringResponse>(`${this.URL}${Modules.Resource.toLowerCase()}/${Modules.Hiring.toLowerCase()}`, data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // this.errorHandler.log("Error while updating a todo", error);
          return throwError(Common.error_update + Modules.Hiring.toLowerCase() + error.message);
        }));
  }

  updateHiringStatus(data: updateHiringStatus): Observable<hiringResponse> {
    return this.http.put<hiringResponse>(`${this.URL}${Modules.Resource.toLowerCase()}/${Modules.Hiring.toLowerCase()}/${Modules.Status.toLowerCase()}`, data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // this.errorHandler.log("Error while updating a todo", error);
          return throwError(Common.error_update + Modules.Hiring.toLowerCase()+' '+Modules.Status.toLowerCase() + error.message);
        }));
  }
}
