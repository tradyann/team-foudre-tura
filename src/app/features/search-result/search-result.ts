import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { SharedService } from '../../core/services/shared.service';
import { LucideAngularModule, TrophyIcon, UsersIcon, BikeIcon, FlagIcon, SearchIcon } from 'lucide-angular';
import { CommonModule } from '@angular/common';

export interface Competition {
  competitionId: number;
  competitionName: string;
  typeCompetition?: string;
  tierCompetition?: string | number;
  stagesCount?: number;
  isClosed?: boolean;
  eventClassName: string;
}

export interface Team {
  teamId: number;
  teamName: string;
  teamCode?: string;
  flag?: string;
  nbrRiders: number;
  owners: number;
}

export interface Racer {
  idClient: number;
  zwiftId: number;
  racerName: string;
  flag?: string;
  male?: boolean;
  scoring?: number;
  teamCode: string;
}

export interface Result {
  competitions: Competition[];
  teams: Team[];
  racers: Racer[];
}

@Component({
  selector: 'app-search-result',
  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule
  ],
  templateUrl: './search-result.html',
  styleUrl: './search-result.css'
})
export class SearchResult {
  private route = inject(ActivatedRoute);
  private sharedService = inject(SharedService);

  // SIGNALS
  results = signal<Result | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  // SIGNALS FOR ROUTE PARAMETERS
  readonly query = signal<string | null>(null);

  // Selectors simples
  competitions = computed(() => this.results()?.competitions ?? []);
  teams = computed(() => this.results()?.teams ?? []);
  racers = computed(() => this.results()?.racers ?? []);

  TrophyIcon = TrophyIcon;
  UsersIcon = UsersIcon;
  BikeIcon = BikeIcon;
  FlagIcon = FlagIcon;
  SearchIcon = SearchIcon;

  constructor() {
     // SUBSCRIBE TO ROUTE PARAMETER CHANGES
    this.route.paramMap.subscribe((params: ParamMap) => {
      const query = params.get('query');

      // UPDATE SIGNALS
      this.query.set(query);
    });
    
    effect(() => {
      const query = this.query();

      if (!query) {
        this.error.set('Missing query');
        this.loading.set(false);
        return;
      }

      this.loading.set(true);
      this.error.set(null);

      this.sharedService.searchQuery(query).subscribe({
        next: (data: any) => {
          this.results.set(data);
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
}
