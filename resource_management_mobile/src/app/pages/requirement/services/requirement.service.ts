import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { requirementResponse } from '../models/requirement.model';

@Injectable({
  providedIn: 'root'
})
export class RequirementService {
  private URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getRequirement(skip: number, limit: number, search: string): Observable<any> {
    let urlParams = new URLSearchParams();
    urlParams.append('skip', skip.toString());
    urlParams.append('limit', limit.toString());
    urlParams.append('search', search);

    return this.http.get<requirementResponse>(`${this.URL}requirement?` + urlParams,);
  }

  getRequirementAllData() {
    return this.http.get<requirementResponse>(`${this.URL}requirement`);
  }

  addRequirement(data: any) {
    return this.http.post(`${this.URL}requirement`, data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError("Error while creating a resource" + error.message);
        }));
  }


  updateRequirement(data: any): Observable<any> {
    return this.http.put<any>(`${this.URL}requirement`, data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError("Error while updating a resource " + error.message);
        }));
  }

  deleteRequirement(id: string) {
    return this.http.delete(`${this.URL}requirement/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError("Error while deleting a requirement " + error.message);
      }));
  }
}
