import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CypherService } from '../../core/services/cypher.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private http = inject(HttpClient);
  private cypher = inject(CypherService);
  private baseUrl = environment.ApiBaseUrl;

  getResetCode(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}api/account/reset-code`, {
      params: { crypted: id }
    });
  }

  getActivation(key: string): Observable<any> {
    return this.http.get(`${this.baseUrl}api/public/activate`, {
      params: { key }
    });
  }

  validateAccount(userid: string, affiliateid: string): Observable<any> {
    const stampToken = this.cypher.cypherStamped();
    return this.http.post(`${this.baseUrl}api/public/validate-account`, null, {
      headers: { 'X-API-KEY': stampToken },
      params: { userid, affiliateid }
    });
  }

  getRegistrationCode(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}api/account/registration-code`, {
      params: { crypted: id }
    });
  }

  linkZwiftId(email: string, zwiftId: number): Observable<any> {
    const payload = { Email: email, ZwiftId: zwiftId };
    return this.http.post(`${this.baseUrl}api/public/link-zwift`, payload);
  }
}
