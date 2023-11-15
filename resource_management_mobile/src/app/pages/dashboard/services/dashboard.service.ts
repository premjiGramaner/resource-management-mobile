import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private URL = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getDashboardClient(req: any): Observable<any> {
    return this.http.post<any>(`${this.URL}dashboard/client`, req);
  }
}
