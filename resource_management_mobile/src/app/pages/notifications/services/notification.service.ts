import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { notificationResponce } from '../model/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getNotification(skip: number, limit: number, search: string): Observable<notificationResponce> {
    let urlParams = new URLSearchParams();
    urlParams.append('skip', skip.toString());
    urlParams.append('limit', limit.toString());
    urlParams.append('search', search);
    return this.http.get<notificationResponce>(`${this.URL}resource/remainders?` + urlParams);
  }

  getAllNotification(): Observable<notificationResponce> {
    return this.http.get<notificationResponce>(`${this.URL}resource/remainders`);
  }

}
