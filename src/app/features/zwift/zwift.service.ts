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

}
