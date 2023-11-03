import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { partnerResponce, partnerData, skillResponce } from '../models/partner.model';

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
    return this.http.post<partnerResponce>(`${this.URL}partner/getPartners`, data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError("Error while fetching partners" + error.message);
        }));
  }

  getPartner(skip: number, limit: number, search: string): Observable<partnerResponce> {
    let urlParams = new URLSearchParams();
    urlParams.append('skip', skip.toString());
    urlParams.append('limit', limit.toString());
    urlParams.append('search', search);
    return this.http.get<partnerResponce>(`${this.URL}partner?` + urlParams);
  }

  postPartner(PartnerSaveReq: partnerData) {
    return this.http.post(`${this.URL}partner`, PartnerSaveReq).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Error while posting a data ' + error.message);
      })
    );
  }

  editPartner(PartnerUpdateReq: partnerData) {
    return this.http.put(`${this.URL}partner`, PartnerUpdateReq).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Error while update a data ' + error.message);
      })
    );
  }

  deletePartner(id: string) {
    return this.http.delete(`${this.URL}partner/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Error while deleting a data ' + error.message);
      })
    );
  }

  getSkill(): Observable<skillResponce> {
    return this.http.get<skillResponce>(`${this.URL}skill`);
  }

}
