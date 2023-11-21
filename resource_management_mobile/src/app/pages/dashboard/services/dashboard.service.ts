import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PostClientChart, PostRemainderChart } from '../models/dashboard.model';
import { dashboardClientResponse, dashboardRequirementResponse, dashboardResourceResponse } from '../models/dashboard.API.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private URL = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getDashboardClient(req: PostClientChart): Observable<dashboardClientResponse> {
    return this.http.post<dashboardClientResponse>(`${this.URL}dashboard/client`, req);
  }

  getDashboardRequirement(req: PostClientChart): Observable<dashboardRequirementResponse> {
    return this.http.post<dashboardRequirementResponse>(`${this.URL}dashboard/reminder`, req);
  }

  getDashboardResource(req: PostClientChart): Observable<dashboardResourceResponse> {
    return this.http.post<dashboardResourceResponse>(`${this.URL}dashboard/resource`, req);
  }

  getDashboardRemainder(req: PostRemainderChart): Observable<any> {
    return this.http.post<any>(`${this.URL}dashboard/reminder`, req);
  }
}
