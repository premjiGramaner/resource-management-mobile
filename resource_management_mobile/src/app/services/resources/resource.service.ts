import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const URL_PREFIX = "http://localhost:5001/api/resource";

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  constructor(private http: HttpClient) { }
  getResources(skip: number, limit: number, search: string): Observable<any> {
    let urlParams = new URLSearchParams();
    urlParams.append('skip', skip.toString());
    urlParams.append('limit', limit.toString());
    urlParams.append('search', search);

    return this.http.get<any>(`${URL_PREFIX}?` + urlParams,);
  }

  addresource(data: any) {
    return this.http.post(`${URL_PREFIX}`, data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError("Error while creating a resource" + error.message);
        }));
  }


  updateResource(data: any): Observable<any> {
    return this.http.put<any>(`${URL_PREFIX}`, data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // this.errorHandler.log("Error while updating a todo", error);
          console.log(error.message);
          return throwError("Error while updating a resource " + error.message);
        }));
  }

  deleteResource(id: string) {
    return this.http.delete(`${URL_PREFIX}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error.message);
        return throwError("Error while deleting a resource " + error.message);
      }));
  }


}
