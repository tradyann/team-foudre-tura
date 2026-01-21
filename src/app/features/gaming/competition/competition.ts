import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { GamingService } from '../gaming.service';
import { DurationPipe } from '../../../shared/pipes/duration.pipe';
import { LucideAngularModule, TrophyIcon } from 'lucide-angular';

export interface Competition {
  idClient: number;
  competitionId: number;
  competitionName: string;
  typeCompetition: string;   // ex: "TOUR"
  accessType: number;        // 1=open, 2=premium, 3=private ?
  stagesCount: number;
  isClosed: boolean;
  timeNeutralLimit: number;
  prestigeName: string;
  stars: number;
  prizePool: number;
  eventClassName: string;
  fromDate: Date;
  toDate: Date;
  dateValidated: boolean;
  competCategory: string;
  stages: Stages[];
}

export interface Roadbook {
  roadbookId: number;
  laps: number;
  distanceInMeters: number;
  durationInSeconds: number;
  raceFormatName: string;
  routeName: string;
  links: string;
}

export interface Division {
  id: number;
  cat: string;
}

export interface Stages {
  stageId: number;
  stageNumber: number;
  division: number;
  divisionStructure: Division[];
  stageDate: Date;
  stageType: number;
  timeMultiplier: number;
  raceTypeName: string;
  roadbook: Roadbook;
}

@Component({
  selector: 'app-competition',
  imports: [CommonModule, RouterLink, DurationPipe, LucideAngularModule],
  templateUrl: './competition.html',
  styleUrl: './competition.css'
})
export class Competition {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  gamingService = inject(GamingService);

  // SIGNALS FOR ROUTE PARAMETERS
  readonly competId = signal<number | null>(null);

  // DATA
  competition = signal<Competition | null>(null);
  results = signal<Stages[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  TrophyIcon = TrophyIcon;

  constructor() {
     // SUBSCRIBE TO ROUTE PARAMETER CHANGES
    this.route.paramMap.subscribe((params: ParamMap) => {
      const competitionId = Number(params.get('competitionId'));

      // UPDATE SIGNALS
      this.competId.set(competitionId);
    });

    effect(() => {
      const competId = this.competId();

      if (!competId) {
        this.error.set('Missing competId');
        this.loading.set(false);
        return;
      }

      this.loading.set(true);
      this.error.set(null);

      this.gamingService.getCompetition(competId).subscribe({
        next: (data) => {
          this.competition.set(data);
          this.results.set(data.stages);
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

  goToResults(stageNumber: number) {
    const favoriteCat = localStorage.getItem('favCat') || 'E';
    this.router.navigate(['/zw/stage-results', this.competId(), favoriteCat, stageNumber])
  }

  goToClassification() {
    const favoriteCat = localStorage.getItem('favCat') || 'E';
    this.router.navigate(['/zw/competition-results', this.competId(), favoriteCat, 0])
  }

}