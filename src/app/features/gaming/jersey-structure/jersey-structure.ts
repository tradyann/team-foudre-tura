import { Component, effect, inject, signal } from '@angular/core';
import { GamingService } from '../gaming.service';

export interface PointsStructure {
  stakesPointId: number;
  pointsDesc: string;
  details: PointsPlaces[];
}

export interface TimesStructure {
  stakesTimeId: number;
  details: TimesPlaces[];
}

export interface PointsPlaces {
  place: number;
  pts: number;
}

export interface TimesPlaces {
  place: number;
  seconds: number;
}


@Component({
  selector: 'app-jersey-structure',
  imports: [],
  templateUrl: './jersey-structure.html',
  styleUrl: './jersey-structure.css'
})
export class JerseyStructure {
  gamingService = inject(GamingService);

  // DATA
  pointsStructure = signal<PointsStructure[]>([]);
  timesStructure = signal<TimesStructure[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadDatas();
  }

  loadDatas() {
    this.gamingService.jerseyStructure().subscribe({
        next: (data) => {
          this.pointsStructure.set(data.points);
          this.timesStructure.set(data.times);
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
