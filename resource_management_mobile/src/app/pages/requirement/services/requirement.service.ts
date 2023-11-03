import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { addRequirementData, deleteRequirementResponse, requiementData, requirementResponse } from '../models/requirement.model';
import { Requirement, Common } from 'src/app/core/enum/static.enum';

@Injectable({
  providedIn: 'root'
})
export class RequirementService {
  private URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getRequirement(skip: number, limit: number, search: string): Observable<any> {
    let urlParams = new URLSearchParams();
    urlParams.append(Common.skip, skip.toString());
    urlParams.append(Common.limit, limit.toString());
    urlParams.append(Common.search, search);

    return this.http.get<requirementResponse>(`${this.URL}${Requirement.requirement}?` + urlParams,);
  }

  getRequirementAllData() {
    return this.http.get<requirementResponse>(`${this.URL}${Requirement.requirement}`);
  }

  addRequirement(data: addRequirementData) {
    return this.http.post<requirementResponse>(`${this.URL}${Requirement.requirement}`, data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(Requirement.error_create + error.message);
        }));
  }


  updateRequirement(data: addRequirementData) {
    return this.http.put<requirementResponse>(`${this.URL}${Requirement.requirement}`, data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(Requirement.error_update + error.message);
        }));
  }

  deleteRequirement(id: number) {
    return this.http.delete<deleteRequirementResponse>(`${this.URL}${Requirement.requirement}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(Requirement.error_delete + error.message);
      }));
  }
}
