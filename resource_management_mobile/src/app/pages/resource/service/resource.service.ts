import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { addResourceData, deleteResourceResponce, resourceResponse } from '../models/resource.model';
import { Common, Modules } from 'src/app/core/enum/static.enum';


@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getResources(skip: number, limit: number, search: string, requirement_ID: number[], isBench: boolean): Observable<resourceResponse> {
    let resourceRequest = {
      skip: skip,
      limit: limit,
      search: search,
      requirementIds: requirement_ID,
      isBench: isBench
    }
    return this.http.post<resourceResponse>(`${this.URL}resource/getResources`, resourceRequest);
  }

  getResourceAllData() {
    let resourceRequest = {
      requirementIds: [],
      isBench: false
    }
    return this.http.post<resourceResponse>(`${this.URL}resource/getResources`, resourceRequest);
  }

  addresource(data: addResourceData) {
    return this.http.post<resourceResponse>(`${this.URL}${Modules.Resource.toLowerCase()}`, data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(Common.error_create + Modules.Resource.toLowerCase() + error.message);
        }));
  }


  updateResource(data: addResourceData): Observable<resourceResponse> {
    return this.http.put<resourceResponse>(`${this.URL}${Modules.Resource.toLowerCase()}`, data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // this.errorHandler.log("Error while updating a todo", error);
          return throwError(Common.error_update + Modules.Resource.toLowerCase() + error.message);
        }));
  }

  deleteResource(id: number) {
    return this.http.delete<deleteResourceResponce>(`${this.URL}${Modules.Resource.toLowerCase()}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(Common.error_delete + Modules.Resource.toLowerCase() + error.message);
      }));
  }
}
