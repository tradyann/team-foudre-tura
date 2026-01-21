import { Component, effect, inject, signal } from '@angular/core';
import { GamingService } from '../gaming.service';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';

export interface TeamMember {
  zwiftId: number;
  idClient: number;
  racerName: string;
  male: boolean;
  tCat: 'E' | 'A' | 'B' | 'C' | 'D';
  scoring: number;
  veloScore?: number;
  phenotype?: string;
  imageSrc?: string;
  flag?: string;
}
export interface TeamData {
  teamId: number;
  teamName: string;
  teamCode?: string;
  flag?: string; // code pays pour l’icône
  hasTeam: boolean;
  members: TeamMember[];
}

@Component({
  selector: 'app-team-details',
  imports: [RouterLink],
  templateUrl: './team-details.html',
  styleUrl: './team-details.css'
})
export class TeamDetails {
  gamingService = inject(GamingService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // SIGNALS FOR ROUTE PARAMETERS
  readonly teamId = signal<number | null>(null);

  // DATA
  result = signal<TeamData | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
     // SUBSCRIBE TO ROUTE PARAMETER CHANGES
    this.route.paramMap.subscribe((params: ParamMap) => {
      const competitionId = Number(params.get('teamId'));

      // UPDATE SIGNALS
      this.teamId.set(competitionId);
    });

    effect(() => {
      const teamId = this.teamId();

      if (!teamId) {
        this.error.set('Missing teamId');
        this.loading.set(false);
        return;
      }

      this.loading.set(true);
      this.error.set(null);

      this.gamingService.teamDetails(teamId).subscribe({
        next: (data) => {
          // Accepte soit {teamId,...} soit {results:{teamId,...}}
          const team: TeamData | null =
            (data && 'members' in data) ? data as TeamData :
            (data && data.results && 'members' in data.results) ? data.results as TeamData :
            null;

          if (!team) {
            throw new Error('Unexpected payload shape');
          }
          this.result.set(team);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Error loading results');
          console.error(err);
          this.loading.set(false);
        }
      });
    });
  }

  onJoin() {
    const teamId = this.teamId();
    if (!teamId) {
      this.error.set('Missing teamId');
      this.loading.set(false);
      return;
    }

    if (confirm('Do you confirm?')) {
      this.gamingService.teamJoin(teamId).subscribe(
        {
        next: (res) => {
          if(res.response === 'success') {
            this.router.navigate(['/user/team']);
          } else {
              if(res.description === 'ALREADY_IN_TEAM'){
              this.error.set('You are already in a team');
            }  else if (res.description === 'LINK_ZWIFT_FIRST') {
              this.error.set('Link your zwift account first');
            } else {
              this.error.set(res.description);
            }
          }
        },
        error: (err) => {
          this.error.set('Error');
          console.error(err);
          this.loading.set(false);
        }
      });
    }
  }
}
