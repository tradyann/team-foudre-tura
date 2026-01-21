import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GamingService } from '../../gaming.service';
import { CommonModule } from '@angular/common';

export interface Team {
  teamId: number; 
  teamName: string;
  teamCode: string;
  flag: string;
  countRiders: number;
  balanceTeam: number;
}

@Component({
  selector: 'app-list-teams',
  imports: [CommonModule, RouterLink],
  templateUrl: './list-teams.html',
  styleUrl: './list-teams.css'
})
export class ListTeams {
  gamingService = inject(GamingService);

  // DATA
  results = signal<Team[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.gamingService.listTeams().subscribe({
        next: (data) => {
          this.results.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Error loading results');
          console.error(err);
          this.loading.set(false);
        }
      });
  }
}
