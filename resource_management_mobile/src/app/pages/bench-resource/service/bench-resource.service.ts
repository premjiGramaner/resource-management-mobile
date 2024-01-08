import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { resourceResponse } from '../../resource/models/resource.model';
import { benchResponse } from '../model/bench.resource';

@Injectable({
  providedIn: 'root'
})
export class BenchResourceService {
  private URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getBenchData(
    skip: number,
    limit: number,
    search: string
  ): Observable<benchResponse> {
    let urlParams = new URLSearchParams();
    urlParams.append('skip', skip.toString());
    urlParams.append('limit', limit.toString());
    urlParams.append('search', search);
    return this.http.get<benchResponse>(`${this.URL}resource/getBench?` + urlParams);
  }

  getAllBenchData(): Observable<benchResponse> {
    return this.http.get<benchResponse>(`${this.URL}resource/getBench`);
  }
}
