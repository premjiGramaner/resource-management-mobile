import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResourceResponse, editResourceRequest, postResourceRequest, resourceId, resourceMatchedData } from '../models/resource-requirement-model';


@Injectable({
  providedIn: 'root'
})
export class ResourceRequirementService {
  private URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getResource(
    skip: number,
    limit: number,
    search: string
  ): Observable<ResourceResponse> {
    let urlParams = new URLSearchParams();
    urlParams.append('skip', skip.toString());
    urlParams.append('limit', limit.toString());
    urlParams.append('search', search);

    return this.http.get<ResourceResponse>(`${this.URL}resource/requirement?` + urlParams);
  }

  getAllResource(): Observable<ResourceResponse> {
    return this.http.get<ResourceResponse>(`${this.URL}resource/requirement`);
  }

  getSigleRequirement(requestRequirementId: resourceId): Observable<resourceMatchedData> {
    return this.http.post<resourceMatchedData>(`${this.URL}resource/getMatch`, requestRequirementId);
  }

  postResource(requestResource: postResourceRequest): Observable<postResourceRequest> {
    return this.http.post<postResourceRequest>(`${this.URL}resource/requirement`, requestResource);
  }

  editResource(requestResource: editResourceRequest): Observable<editResourceRequest> {
    return this.http.put<editResourceRequest>(`${this.URL}resource/requirement`, requestResource);
  }

  deleteResource(id: string) {
    return this.http.delete(`${this.URL}resource/requirement/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Error while deleting a data ' + error.message);
      })
    );
  }

}
