import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ManagerService {

    private http = inject(HttpClient);
    private baseUrl = environment.ApiBaseUrl;

    
    competitionRoutes(competitionId: number): Observable<any> {
        return this.http.get(this.baseUrl + 'api/manager/competition-routes', {
            params: { competitionId }
        });
    }
    

}
