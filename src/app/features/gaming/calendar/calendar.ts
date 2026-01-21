import { Component, inject, signal } from '@angular/core';
import { GamingService } from '../gaming.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface Competitions {
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
}

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, RouterLink],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
export class Calendar {
  gamingService = inject(GamingService);

  // DATA
  results = signal<Competitions[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  five = [0,1,2,3,4];

  ngOnInit() {
    this.gamingService.getCalendar().subscribe({
        next: (data) => {
          this.results.set(data.competitions);
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
