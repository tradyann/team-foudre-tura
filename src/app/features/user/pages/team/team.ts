import { Component, inject, signal } from '@angular/core';
import { GamingService } from '../../../gaming/gaming.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


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
  balanceTeam: number;
  members: TeamMember[];
}

@Component({
  selector: 'app-team',
  imports: [CommonModule, RouterLink],
  templateUrl: './team.html',
  styleUrl: './team.css'
})
export class Team {
  gamingService = inject(GamingService);

  // DATA
  result = signal<TeamData | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    // Initial load with default dates
    this.load();
  }
  
  load() {
    this.loading.set(true);
    this.error.set(null);

    this.gamingService.userTeam(
    ).subscribe({
      next: (data) => {

        if(data) {
          const team: TeamData | null =
            (data && 'members' in data) ? data as TeamData :
            (data && data.results && 'members' in data.results) ? data.results as TeamData : null;

          if (!team) {
            throw new Error('Unexpected payload shape');
          }
          this.result.set(team);
        } else {
          this.error.set('No team found');
        }
        
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        if(err.status === 401) { alert('Unauthorized. Try to login again.') };
        this.error.set('Error loading results');
        this.loading.set(false);
      }
    });
  }
}
