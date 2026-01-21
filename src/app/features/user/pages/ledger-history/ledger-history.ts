import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { GamingService } from '../../../gaming/gaming.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ledger-history',
  imports: [CommonModule],
  templateUrl: './ledger-history.html',
  styleUrl: './ledger-history.css'
})
export class LedgerHistory {
  gamingService = inject(GamingService);

    // DATA
  results = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  totalRows = signal(0);
  totalPages = signal(0);
  entries = signal('');         // e.g. "1 - 100 of 686"

  // pagination (index is 0-based for backend)
  pageNumber = signal<number>(1);
  // optional helper if your API returns totalPages but UI needs a number:
  totalPagesSafe = computed(() => Math.max(1, this.totalPages() || 1));
  rowsPerPage = signal<number>(50);

  startTime = input<Date>();
  endTime = input<Date>();

  // Set up default dates
  private today = new Date(); // Current date in UTC
  private threeMonthsAgo = new Date(
    Date.UTC(
      this.today.getUTCFullYear(),
      this.today.getUTCMonth() - 3,
      this.today.getUTCDate()
    )
  );

  // Local writable signals with default values
  startTimeSignal = signal<Date>(this.threeMonthsAgo);
  endTimeSignal = signal<Date>(this.today);

  constructor() {
    effect(() => {
      const start = this.startTime();
      const end = this.endTime();

      // Use fallback if input is not yet available
      if (start && end) {
        this.startTimeSignal.set(start);
        this.endTimeSignal.set(end);
        this.load();
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    // Initial load with default dates
    this.load();
  }
  
  load() {
    this.loading.set(true);
    this.error.set(null);

    const start = this.startTimeSignal();
    const end = this.endTimeSignal();

    this.gamingService.userLedgerHistory(
      start.toUTCString(), 
      end.toUTCString(),
      (this.pageNumber() - 1),
      this.rowsPerPage()
    ).subscribe({
      next: (data) => {
        this.results.set(data.results);
        this.totalRows.set(data.totalRows ?? 0);
        this.totalPages.set(data.totalPages ?? 0);
        this.entries.set(data.entries ?? '');
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

  onPageSizeChange(ev: Event) {
    const v = Number((ev.target as HTMLSelectElement).value);
    this.rowsPerPage.set(v);
    this.pageNumber.set(1);
    this.load();
  }

  goTo(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.pageNumber.set(page);
    this.load();
  }

  next() { this.goTo(this.pageNumber() + 1); }
  prev() { this.goTo(this.pageNumber() - 1); }
}
