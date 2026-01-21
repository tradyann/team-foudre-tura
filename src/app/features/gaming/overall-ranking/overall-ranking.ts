import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, filter, Subject } from 'rxjs';
import { GamingService } from '../gaming.service';


export interface Rider {
  idClient: number;
  rowNumber: number;
  male?: boolean | null;
  racerName: string;
  flag?: string | null;
  teamId?: number | null;
  teamCode?: string | null;
  balanceRider: number;
  isTarget: boolean; // if this is the user
}

export interface PagedRidersResponse {
  totalRows: number;
  totalPages: number;
  totalNumber: number;
  entries: string;
  results: Rider[];
}

@Component({
  selector: 'app-overall-ranking',
  imports: [CommonModule, RouterLink],
  templateUrl: './overall-ranking.html',
  styleUrl: './overall-ranking.css'
})
export class OverallRanking {
gamingService = inject(GamingService);

  // DATA
  results = signal<Rider[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  totalRows = signal(0);
  totalPages = signal(0);
  entries = signal('');         // e.g. "1 - 100 of 686"

  // search & pagination
  query = signal<string>('');
  pageNumber = signal<number>(1);
  rowsPerPage = signal<number>(25);

  search$ = new Subject<string>();

  
  ngOnInit() {
    this.search$
    .pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      filter(value => value.trim().length === 0 || value.trim().length >= 3) // Min 3 characters
    )
    .subscribe(q => {
      this.query.set(q);
      this.pageNumber.set(1);
      this.load();
    });
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);

    this.gamingService.overallRanking(
      this.query(),
      (this.pageNumber() - 1),
      this.rowsPerPage()
    ).subscribe({
      next: (data) => {
        if(data) {
          this.results.set(data.results );
          this.totalRows.set(data.totalRows ?? 0);
          this.totalPages.set(data.totalPages ?? 0);
          this.entries.set(data.entries ?? '');
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

  onSearch(ev: Event) {
    const value = (ev.target as HTMLInputElement).value;
    this.search$.next(value);
  }

  clearSearch() {
    this.search$.next('');
  }

  onPageSizeChange(ev: Event) {
    const v = Number((ev.target as HTMLSelectElement).value);
    this.rowsPerPage.set(v);
    this.pageNumber.set(1);
    this.load();
  }

  // goTo(page: number) {
  //   if (page < 1 || page > this.totalPages()) return;
  //   this.pageNumber.set(page);
  //   this.load();
  // }

  // next() { this.goTo(this.pageNumber() + 1); }
  // prev() { this.goTo(this.pageNumber() - 1); }
}
