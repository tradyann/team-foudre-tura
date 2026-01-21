import { Component, inject, signal } from '@angular/core';
import { ZwiftService } from '../zwift/zwift.service';
import { CommonModule } from '@angular/common';

export interface Datas {
  zwiftId: number;
  firstName: string;
  lastName: string;
  wkgAdj: number;
  poids: number;
  taille: number;
  male: boolean;
  wk15: number;
  wk60: number;
  wk300: number;
  wk1200: number;
}


@Component({
  selector: 'app-compet',
  imports: [CommonModule],
  templateUrl: './compet.html',
  styleUrl: './compet.css'
})
export class Compet {
  zwiftService = inject(ZwiftService);

  results = signal<Datas[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('devKey', 'thisIsMySecretKeyForDev');
  }

  load() {
    this.zwiftService.getCompetPerso().subscribe(
      {
        next: (data) => {
          //console.log(data)

          // tri décroissant (du plus fort au plus faible)
          const sorted = [...data].sort((a, b) => b.wkgAdj - a.wkgAdj);

          this.results.set(sorted);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Error loading results');
          console.error(err);
          this.loading.set(false);
        }
      }
    )
  }
}
