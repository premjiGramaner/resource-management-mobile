import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PostClientChart } from '../models/dashboard.model';
import { dashboardClientResponse } from '../models/dashboard.API.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private URL = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getDashboardClient(req: PostClientChart): Observable<dashboardClientResponse> {
    return this.http.post<dashboardClientResponse>(`${this.URL}dashboard/client`, req);
  }
}
