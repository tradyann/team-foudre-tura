import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private baseUrl = environment.ApiBaseUrl;

  getClientDetails(): Observable<any> {
    return this.http.get(`${this.baseUrl}api/profile/racer-details/`);
  }

  get2FaStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}api/profile/factor-status/`);
  }

  set2FaOnOff(pincode: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}api/profile/two-factor/`,
      null,
      {
        params: { PinCode: pincode },
        responseType: 'text'
      }
    );
  }

  changeTimeZone(timeZone: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}api/profile/change-timezone`,
      null,
      { params: { timezone: timeZone } }
    );
  }

  getHelpCenter(): Observable<any> {
    return this.http.get(`${this.baseUrl}api/public/help-center/`);
  }

  getChatbot(query: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}api/profile/chatbot/`,
      { query }
    );
  }

  getTerms(): Observable<any> {
    return this.http.get(`${this.baseUrl}api/public/terms/`);
  }

  logout(): void {
    // localStorage.clear(); // si tu veux garder dark theme, supprime clé par clé
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('sportsList');

    window.location.href = '/account/login';
  }
}
