import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ValidateUrlResponse } from '../model/models/validate-url-response';

@Injectable({
  providedIn: 'root'
})
export class VerifyUrlService {

  constructor(private http: HttpClient) { }

 checkUrl(url: string): Observable<ValidateUrlResponse> {
    return this.http.post<ValidateUrlResponse>('/api/validate-url', { url });
  }
}
