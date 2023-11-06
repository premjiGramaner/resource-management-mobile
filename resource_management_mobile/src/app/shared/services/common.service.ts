import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { stageResponse, statusResponse } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getStatus(): Observable<statusResponse> {
    return this.http.get<statusResponse>(`${this.URL}status`);
  }

  getStage(): Observable<stageResponse> {
    return this.http.get<stageResponse>(`${this.URL}stage`);
  }
}
