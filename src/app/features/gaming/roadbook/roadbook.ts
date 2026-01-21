import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { GamingService } from '../gaming.service';

export interface RoadbookItem {
  lap: number;
  segmentName: string;
  jerseyName: string;
  points: SegmentPts[];
  timeBonuses: SegmentTime[];
}

export interface SegmentPts {
  place: number;
  pts: number;
}

export interface SegmentTime {
  place: number;
  seconds: number;
}

@Component({
  selector: 'app-roadbook',
  imports: [],
  templateUrl: './roadbook.html',
  styleUrl: './roadbook.css'
})
export class Roadbook {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  gamingService = inject(GamingService);

  // SIGNALS FOR ROUTE PARAMETERS
  readonly rbId = signal<number | null>(null);

  // DATA
  roadbook = signal<RoadbookItem[]>([]);
  //results = signal<Stages[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
     // SUBSCRIBE TO ROUTE PARAMETER CHANGES
    this.route.paramMap.subscribe((params: ParamMap) => {
      const rbId = Number(params.get('roadbookId'));

      // UPDATE SIGNALS
      this.rbId.set(rbId);
    });

    effect(() => {
      const roadbookId = this.rbId();

      if (!roadbookId) {
        this.error.set('Missing roadbookId');
        this.loading.set(false);
        return;
      }

      this.loading.set(true);
      this.error.set(null);

      this.gamingService.getRoadbook(roadbookId).subscribe({
        next: (data) => {
          this.roadbook.set(data ?? []);
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