import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  PostCategoryChart,
  PostClientChart,
  PostRemainderChart,
} from '../models/dashboard.model';
import {
  dashboardClientResponse,
  dashboardHiringResponse,
  dashboardReminderInfoResponse,
  dashboardRequirementResponse,
  dashboardResourceRequirementResponse,
  dashboardResourceResponse,
} from '../models/dashboard.API.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private URL = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getDashboardClient(
    req: PostClientChart
  ): Observable<dashboardClientResponse> {
    return this.http.post<dashboardClientResponse>(
      `${this.URL}dashboard/client`,
      req
    );
  }

  getDashboardRequirement(
    req: PostClientChart
  ): Observable<dashboardRequirementResponse> {
    return this.http.post<dashboardRequirementResponse>(
      `${this.URL}dashboard/requirement`,
      req
    );
  }

  getDashboardResource(
    req: PostClientChart
  ): Observable<dashboardResourceResponse> {
    return this.http.post<dashboardResourceResponse>(
      `${this.URL}dashboard/resource`,
      req
    );
  }

  getDashboardRemainder(
    req: PostRemainderChart
  ): Observable<dashboardReminderInfoResponse> {
    return this.http.post<dashboardReminderInfoResponse>(
      `${this.URL}dashboard/reminder`,
      req
    );
  }

  getDashboardHiring(
    req: PostCategoryChart
  ): Observable<dashboardHiringResponse> {
    return this.http.post<dashboardHiringResponse>(
      `${this.URL}dashboard/hiring`,
      req
    );
  }

  getDashboardResourceRequirement(
    req: PostCategoryChart
  ): Observable<dashboardResourceRequirementResponse> {
    return this.http.post<dashboardResourceRequirementResponse>(
      `${this.URL}dashboard/resourceRequirement`,
      req
    );
  }
}
