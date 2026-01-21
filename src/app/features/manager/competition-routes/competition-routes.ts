import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ManagerService } from '../manager.service';
import { CommonModule } from '@angular/common';

export interface CompetitionStages {
  stageId: number;
  competitionId: number;
  stageNumber: number;
  division: number;
  stageDate: Date;
  routeId: number;
  routeName: string;
  segments: Segments[];
}

export interface Segments {
  segmentId: number;
  segmentName: string;
  direction: string;
}

@Component({
  selector: 'app-competition-routes',
  imports: [CommonModule],
  templateUrl: './competition-routes.html',
  styleUrl: './competition-routes.css'
})
export class CompetitionRoutes {
  private route = inject(ActivatedRoute);
  managerService = inject(ManagerService);

  // SIGNALS FOR ROUTE PARAMETERS
  readonly competId = signal<number | null>(null);

  // DATA
  competitionStages = signal<CompetitionStages[]>([]);
  results = signal<Segments[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

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

      this.managerService.competitionRoutes(competId).subscribe({
        next: (data) => {
          this.competitionStages.set(data);
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
}
