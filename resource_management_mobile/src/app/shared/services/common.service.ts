import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getStatus(): Observable<any> {
    return this.http.get<any>(`${this.URL}status`);
  }

  getStage(): Observable<any> {
    return this.http.get<any>(`${this.URL}stage`);
  }
}
