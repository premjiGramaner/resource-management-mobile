import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { locationData, locationResponse } from '../models/location.model';
import { Common, Modules } from 'src/app/core/enum/static.enum';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getLocation(skip: number, limit: number, search: string): Observable<locationResponse> {
    let urlParams = new URLSearchParams();
    urlParams.append('skip', skip.toString());
    urlParams.append('limit', limit.toString());
    urlParams.append('search', search);
    return this.http.get<locationResponse>(`${this.URL}location?` + urlParams);
  }

  getAllLocation(): Observable<locationResponse> {
    return this.http.get<locationResponse>(`${this.URL}location`);
  }

  deleteLocation(id: number) {
    return this.http.delete(`${this.URL}location/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(Common.error_delete + Modules.Location.toLowerCase() + error.message);
      })
    );
  }

  postLocation(locationSaveReq: locationData) {
    return this.http.post(`${this.URL}location`, locationSaveReq).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(Common.error_create + Modules.Location.toLowerCase() + error.message);
      })
    );
  }

  editLocation(locationUpdateReq: locationData) {
    return this.http.put(`${this.URL}location`, locationUpdateReq).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(Common.error_update + Modules.Location.toLowerCase() + error.message);
      })
    );
  }
}
