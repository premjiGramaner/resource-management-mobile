import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  addRequirementData,
  deleteRequirementResponse,
  multiResource,
  multiResourceResponse,
  requirementResponse,
  singleResourceResponse,
} from '../models/requirement.model';
import { Modules, Common } from 'src/app/core/enum/static.enum';
import { resourceMatchedData } from '../../resource-requirement/models/resource-requirement-model';

@Injectable({
  providedIn: 'root',
})
export class RequirementService {
  private URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getRequirement(
    skip: number,
    limit: number,
    search: string,
    client: number[]
  ): Observable<any> {
    let requirementRequest = {
      skip: skip,
      limit: limit,
      search: search,
      clients: client,
    };
    return this.http.post<requirementResponse>(
      `${this.URL}requirement/getRequirements`,
      requirementRequest
    );
  }
  getRequirementAllData() {
    let requirementRequest = {
      clients: [],
    };
    return this.http.post<requirementResponse>(
      `${this.URL}requirement/getRequirements`,
      requirementRequest
    );
  }

  addRequirement(data: addRequirementData) {
    return this.http
      .post<requirementResponse>(
        `${this.URL}${Modules.Requirement.toLowerCase()}`,
        data
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(
            Common.error_create +
            Modules.Requirement.toLowerCase() +
            error.message
          );
        })
      );
  }

  updateRequirement(data: addRequirementData) {
    return this.http
      .put<requirementResponse>(
        `${this.URL}${Modules.Requirement.toLowerCase()}`,
        data
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(
            Common.error_update +
            Modules.Requirement.toLowerCase() +
            error.message
          );
        })
      );
  }

  deleteRequirement(id: number) {
    return this.http
      .delete<deleteRequirementResponse>(
        `${this.URL}${Modules.Requirement.toLowerCase()}/${id}`
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(
            Common.error_delete +
            Modules.Requirement.toLowerCase() +
            error.message
          );
        })
      );
  }

  resourceMatchedData(id: number): Observable<resourceMatchedData> {
    let req = {
      requirementId: id,
    };
    return this.http.post<resourceMatchedData>(
      `${this.URL}resource/getMatch`,
      req
    );
  }

  getResourceRquirementById(id: number): Observable<singleResourceResponse> {
    return this.http.get<singleResourceResponse>(
      `${this.URL}resource/requirementById?requirement=${id}`
    );
  }

  updateMultiResourceRquirementById(
    multiResourceReq: multiResource
  ): Observable<multiResourceResponse> {
    return this.http.put<multiResourceResponse>(
      `${this.URL}resource/requirement/resourceStatus`,
      multiResourceReq
    );
  }
}
