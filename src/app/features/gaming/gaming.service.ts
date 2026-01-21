import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GamingService {

    private http = inject(HttpClient);
    private baseUrl = environment.ApiBaseUrl;

    listRiders(query: string, pageIndex: number, rowsPerPage: number): Observable<any> {
        return this.http.get(this.baseUrl + 'api/gaming/riders-list/', {
        params: { query, pageIndex, rowsPerPage }
        });
    }

    listTeams(): Observable<any> {
        return this.http.get(this.baseUrl + 'api/public/teams-list/');
    }

    overallRanking(query: string, pageIndex: number, rowsPerPage: number): Observable<any> {
        return this.http.get(this.baseUrl + 'api/gaming/overall-ranking/', {
        params: { query, pageIndex, rowsPerPage }
        });
    }

    getCalendar(): Observable<any> {
        return this.http.get(this.baseUrl + 'api/public/calendar/');
    }

    getCompetition(competitionId: number): Observable<any> {
        return this.http.get(this.baseUrl + 'api/gaming/competition/', {
        params: { competitionId }
        });
    }

    getRoadbook(roadbookId: number): Observable<any> {
        return this.http.get(this.baseUrl + 'api/gaming/roadbook/', {
        params: { roadbookId }
        });
    }

    userLedgerHistory(startTime: string, endTime: string, pageIndex: number, rowsPerPage: number): Observable<any> {
        return this.http.get(this.baseUrl + 'api/gaming/ledger-client/', {
        params: { startTime, endTime, pageIndex, rowsPerPage }
        });
    }

    teamLedgerHistory(startTime: string, endTime: string, pageIndex: number, rowsPerPage: number): Observable<any> {
        return this.http.get(this.baseUrl + 'api/gaming/ledger-team/', {
        params: { startTime, endTime, pageIndex, rowsPerPage }
        });
    }

    userTeam(): Observable<any> {
        return this.http.get(this.baseUrl + 'api/gaming/user-team/');
    }

    teamDetails(teamId: number): Observable<any> {
        return this.http.get(this.baseUrl + 'api/gaming/team-details/', {
        params: { teamId }
        });
    }

    teamJoin(teamId: number): Observable<any> {
        return this.http.post(this.baseUrl + 'api/gaming/team-join/', null, {
        params: { teamId }
        });
    }

    riderDetails(idClient: number): Observable<any> {
        return this.http.get(this.baseUrl + 'api/gaming/rider-details/', {
        params: { idClient }
        });
    }

    jerseyStructure(): Observable<any> {
        return this.http.get(this.baseUrl + 'api/public/jersey-points-structure/', {
        params: { }
        });
    }
}
