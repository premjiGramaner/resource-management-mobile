import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { addRequirementData, deleteRequirementResponse, requirementResponse } from '../models/requirement.model';
import { Modules, Common } from 'src/app/core/enum/static.enum';

@Injectable({
  providedIn: 'root'
})
export class RequirementService {
  private URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  // getRequirement(skip: number, limit: number, search: string): Observable<any> {
  //   let urlParams = new URLSearchParams();
  //   urlParams.append(Common.skip, skip.toString());
  //   urlParams.append(Common.limit, limit.toString());
  //   urlParams.append(Common.search, search);

  //   return this.http.get<requirementResponse>(`${this.URL}${Modules.Requirement.toLowerCase()}?` + urlParams,);
  // }

  getRequirement(skip: number, limit: number, search: string, client: number[]): Observable<any> {
    let requirementRequest = {
      skip: skip,
      limit: limit,
      search: search,
      clients: client
    }
    return this.http.post<requirementResponse>(`${this.URL}${Modules.Requirement.toLowerCase()}`, requirementRequest);
  }
  getRequirementAllData() {
    return this.http.get<requirementResponse>(`${this.URL}${Modules.Requirement.toLowerCase()}`);
  }

  addRequirement(data: addRequirementData) {
    return this.http.post<requirementResponse>(`${this.URL}${Modules.Requirement.toLowerCase()}`, data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(Common.error_create + Modules.Requirement.toLowerCase() + error.message);
        }));
  }


  updateRequirement(data: addRequirementData) {
    return this.http.put<requirementResponse>(`${this.URL}${Modules.Requirement.toLowerCase()}`, data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(Common.error_update + Modules.Requirement.toLowerCase() + error.message);
        }));
  }

  deleteRequirement(id: number) {
    return this.http.delete<deleteRequirementResponse>(`${this.URL}${Modules.Requirement.toLowerCase()}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(Common.error_delete + Modules.Requirement.toLowerCase() + error.message);
      }));
  }
}
