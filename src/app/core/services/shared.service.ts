import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    httpService = inject(HttpClient);

    baseUrl: string = environment.ApiBaseUrl;

    ConnectedSubject = new BehaviorSubject<number>(0); // 0 init / 1 deconnected / 2 loggued
    MaintenanceSubject = new BehaviorSubject<string>('');
    SupportEmailSubject = new BehaviorSubject<string>('info@turaracing.com');

    isAuthenticated() {
      return this.httpService.get(this.baseUrl + 'api/public/isauthenticated');
    }

    maintenanceMsg() {
      return this.httpService.get(this.baseUrl + 'api/public/maintenance');
    }

    getBalance() {
      return this.httpService.get(this.baseUrl + 'api/bal/global');
    }

    getHomePage(lang: string) {
      return this.httpService.get(this.baseUrl + 'api/public/home-page', {
        params: { lang }
      });
    }

    getInformations() {
      return this.httpService.get(this.baseUrl + 'api/public/information');
    }

    getIPcountry() {
      return this.httpService.get(this.baseUrl + 'api/public/country');
    }

    storeMulti(otherid: string) {
      return this.httpService.post(this.baseUrl + 'api/profile/multi', null, {
        params: { otherId: otherid }
      });
    }

    searchQuery(query: string) {
      return this.httpService.get(this.baseUrl + 'api/profile/search-query', {
        params: { query }
      });
    }

  requestFromConsoleAPI(method: string, url: string, body?: any) {
    const options: any = {
      body,
      responseType: 'text' as const,
      observe: 'response' as const
    };
    return this.httpService.request(method, url, options);
  }
}

