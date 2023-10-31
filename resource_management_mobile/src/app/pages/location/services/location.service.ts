import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { locationData, locationResponce } from '../models/locaton.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getLocation(skip: number, limit: number, search: string): Observable<locationResponce> {
    let urlParams = new URLSearchParams();
    urlParams.append('skip', skip.toString());
    urlParams.append('limit', limit.toString());
    urlParams.append('search', search);
    return this.http.get<locationResponce>(`${this.URL}location?` + urlParams);
  }

  getAllLocation(): Observable<locationResponce> {
    return this.http.get<locationResponce>(`${this.URL}location`);
  }

  deleteLocation(id: string) {
    return this.http.delete(`${this.URL}location/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Error while deleting a data ' + error.message);
      })
    );
  }

  postLocation(locationSaveReq: locationData) {
    return this.http.post(`${this.URL}location`, locationSaveReq).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Error while posting a data ' + error.message);
      })
    );
  }

  editLocation(locationUpdateReq: locationData) {
    return this.http.put(`${this.URL}location`, locationUpdateReq).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Error while update a data ' + error.message);
      })
    );
  }
}
