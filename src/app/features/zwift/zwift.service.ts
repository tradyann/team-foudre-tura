import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ZwiftService {
    http = inject(HttpClient);
    private baseUrl = environment.ApiBaseUrl;

  getHomeCompetitions(): Observable<any> {
    return this.http.get(this.baseUrl + 'api/gaming/home-competitions');
  }

  getHomeJerseys(competitionid: number): Observable<any> {
    const params = new HttpParams().set('competitionid', competitionid);
    return this.http.get(this.baseUrl + 'api/gaming/home-jerseys', { params });
  }

  getStageResults(competitionid: number, category: string, stageNumber: number): Observable<any> {
    const params = new HttpParams()
      .set('competitionid', competitionid)
      .set('stagenumber', stageNumber)
      .set('category', category);
    return this.http.get(this.baseUrl + 'api/zwift/stage-result', { params });
  }

  getStagePoints(competitionid: number, category: string, jerseyid: number, stageNumber: number): Observable<any> {
    const params = new HttpParams()
      .set('competitionid', competitionid)
      .set('stagenumber', stageNumber)
      .set('category', category)
      .set('jerseyid', jerseyid);
    return this.http.get(this.baseUrl + 'api/zwift/stage-points', { params });
  }

  getCompetitonResults(competitionid: number, category: string, stageNumber: number): Observable<any> {
    const params = new HttpParams()
      .set('competitionid', competitionid)
      .set('category', category)
      .set('stagenumber', stageNumber);
    return this.http.get(this.baseUrl + 'api/zwift/competition-result', { params });
  }

  getCompetitonPoints(competitionid: number, category: string, stageNumber: number, jerseyid: number): Observable<any> {
    const params = new HttpParams()
      .set('competitionid', competitionid)
      .set('category', category)
      .set('stagenumber', stageNumber)
      .set('jerseyid', jerseyid);
    return this.http.get(this.baseUrl + 'api/zwift/competition-points', { params });
  }

  getCompetPerso(): Observable<any> {
    return this.http.get(this.baseUrl + 'api/public/compet', {});
  }

  linkZwiftIdSimple(zwiftId: number, urlVideo: string): Observable<any> {
    const payload = { ZwiftId: zwiftId, notes: urlVideo };
    return this.http.post(`${this.baseUrl}api/public/link-zwift-simple`, payload);
  }

  getCategoryData(competitionId: number, zwiftId: number): Observable<{ tCat: string }> {
    const params = new HttpParams().set('zwiftId', zwiftId);
    return this.http.get<{ tCat: string }>(`${this.baseUrl}api/velo/category/${competitionId}/${zwiftId}`, { params });
  }

  competitionRegistration(competitionId: number, zwiftId: number): Observable<{ competitionId: number, zwiftId: number; registered: boolean }> {
    return this.http.post<{ competitionId: number, zwiftId: number; registered: boolean }>(this.baseUrl 
      + `api/zwift/competition-registrant/${competitionId}/${zwiftId}`, null);
  }

  addControlFile(payload: {
    zwiftId: number;
    urlFile: string;
    controlType?: 'VIDEO' | 'FIT' | 'LOG';
  }): Observable<{ zwiftId: number; added: boolean }> {
    return this.http.post<{ zwiftId: number; added: boolean }>(
      `${this.baseUrl}api/zwift/control-file`,
      payload
    );
  }

  getCompetitionRegistered(competitionId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}api/zwift/competition-registered?competitionId=${competitionId}`);
  }
}
