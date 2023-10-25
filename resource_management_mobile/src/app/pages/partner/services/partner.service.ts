import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  private URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAllPartner(): Observable<any> {
    return this.http.get<any>(`${this.URL}partner`);
  }

  getSkillPartner(data: any) {
    return this.http.post(`${this.URL}partner/getPartners`, data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError("Error while fetching partners" + error.message);
        }));
  }
}
