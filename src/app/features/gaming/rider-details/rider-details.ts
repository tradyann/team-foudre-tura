import { Component, effect, inject, signal } from '@angular/core';
import { GamingService } from '../gaming.service';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

export interface RiderData {
    zwiftId: number; 
    racerName: string;
    imageSrc: string;
    flag: string;
    male: boolean;
    scoring: number;
    wk60: number;
    wk300: number;
    wk1200: number;
    w60: number;
    w300: number;
    w1200: number;
    tCat: string;
    teamId: number; 
    teamName: string;
    balance: number; 
}


@Component({
  selector: 'app-rider-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './rider-details.html',
  styleUrl: './rider-details.css'
})
export class RiderDetails {
  gamingService = inject(GamingService);
  private route = inject(ActivatedRoute);

  // SIGNALS FOR ROUTE PARAMETERS
  readonly riderId = signal<number | null>(null);

  // DATA
  results = signal<RiderData | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
     // SUBSCRIBE TO ROUTE PARAMETER CHANGES
    this.route.paramMap.subscribe((params: ParamMap) => {
      const competitionId = Number(params.get('riderId'));

      // UPDATE SIGNALS
      this.riderId.set(competitionId);
    });

    effect(() => {
      const riderId = this.riderId();

      if (!riderId) {
        this.error.set('Missing riderId');
        this.loading.set(false);
        return;
      }

      this.loading.set(true);
      this.error.set(null);

      this.gamingService.riderDetails(riderId).subscribe({
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
    });
  }
}
