import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { partnerData, skillResponce } from '../../partner/models/partner.model';
import { skillData, skillProperties } from '../models/skill.model';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  private URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAllSkill(): Observable<skillResponce> {
    return this.http.get<skillResponce>(`${this.URL}skill`);
  }

  getSkill(
    skip: number,
    limit: number,
    search: string
  ): Observable<skillResponce> {
    let urlParams = new URLSearchParams();
    urlParams.append('skip', skip.toString());
    urlParams.append('limit', limit.toString());
    urlParams.append('search', search);
    return this.http.get<skillResponce>(`${this.URL}skill?` + urlParams);
  }

  postSkill(skillSaveReq: skillData) {
    return this.http.post(`${this.URL}skill`, skillSaveReq).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Error while posting a data ' + error.message);
      })
    );
  }

  editSkill(PartnerUpdateReq: partnerData) {
    return this.http.put(`${this.URL}skill`, PartnerUpdateReq).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Error while update a data ' + error.message);
      })
    );
  }

  deleteSkill(id: string) {
    return this.http.delete(`${this.URL}skill/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Error while deleting a data ' + error.message);
      })
    );
  }
}
