import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResourceResponse, adminResourceRequirementResponse, deleteResponce, editResourceRequest, postResourceRequest, resourceId, resourceMatchedData, updateStatus, updateStatusResponse } from '../models/resource-requirement-model';
import { Common, Modules } from 'src/app/core/enum/static.enum';


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

  getAdminResourceRequirement(skip: number,
    limit: number,
    search: string): Observable<adminResourceRequirementResponse> {
    let urlParams = new URLSearchParams();
    urlParams.append('skip', skip.toString());
    urlParams.append('limit', limit.toString());
    urlParams.append('search', search);

    return this.http.get<adminResourceRequirementResponse>(`${this.URL}resource/requirement/status?` + urlParams);
  }

  updateResourceRequirement(request:updateStatus):Observable<updateStatusResponse>{
    return this.http.put<updateStatusResponse>(`${this.URL}resource/requirement/status`, request);

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

  deleteResource(id: number) {
    return this.http.delete<deleteResponce>(`${this.URL}resource/requirement/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(Common.error_delete + Modules.Resource_requirement.toLowerCase() + error.message);
      })
    );
  }

}
