import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { addResourceData, deleteResourceResponce, resourceResponse } from '../models/resource.model';


@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private URL = environment.baseUrl;

  constructor(private http: HttpClient) { }
  getResources(skip: number, limit: number, search: string): Observable<any> {
    let urlParams = new URLSearchParams();
    urlParams.append('skip', skip.toString());
    urlParams.append('limit', limit.toString());
    urlParams.append('search', search);

    return this.http.get<resourceResponse>(`${this.URL}resource?` + urlParams,);
  }

  getResourceAllData() {
    return this.http.get<resourceResponse>(`${this.URL}resource`);
  }

  addresource(data: addResourceData) {
    return this.http.post<resourceResponse>(`${this.URL}resource`, data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError("Error while creating a resource" + error.message);
        }));
  }


  updateResource(data: addResourceData): Observable<resourceResponse> {
    return this.http.put<resourceResponse>(`${this.URL}resource`, data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // this.errorHandler.log("Error while updating a todo", error);
          return throwError("Error while updating a resource " + error.message);
        }));
  }

  deleteResource(id: number) {
    return this.http.delete<deleteResourceResponce>(`${this.URL}resource/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError("Error while deleting a resource " + error.message);
      }));
  }
}
