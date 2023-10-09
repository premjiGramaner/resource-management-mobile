import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginRequest, LoginResponse } from './models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  URL = environment.baseUrl
  
  constructor(private httpClient:HttpClient) {

  }
  postLoginRequest(req:LoginRequest):Observable<LoginResponse>{
    return this.httpClient.post<LoginResponse>(`${this.URL}user/login`,req)
  }
}
