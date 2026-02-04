import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ZwiftService } from '../zwift.service';
import { CommonModule } from '@angular/common';

type Category = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type Pen = 'A' | 'B' | 'C' | 'D';

@Component({
  selector: 'app-my-category',
  imports: [CommonModule],
  templateUrl: './my-category.html',
  styleUrl: './my-category.css'
})
export class MyCategory {

  private router = inject(Router);
  private zwiftService = inject(ZwiftService);

  zwiftId = signal<number | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  // data = signal<CategoryData | null>(null);
  category = signal<Category | null>(null);
  pen = signal<Pen | null>(null);

  isOpen = signal(true);

  constructor() {

    // =============================
    // MOCK
    // =============================
    // const mockStored = 123456;
    // if (mockStored) {
    //   const score = 1825;

    //   this.zwiftId.set(mockStored);
    //   this.data.set({ zwiftId: mockStored, vEloScore: score });

    //   const cat = this.computeCategory(score);
    //   this.category.set(cat);
    //   this.pen.set(this.computePen(cat));

    //   return;
    // }

    // =============================
    // NORMAL FLOW
    // =============================
    const stored = localStorage.getItem('zwiftIdLinked');
    if (stored) {
      this.zwiftId.set(+stored);
      this.loadData();
    }
  }

  private loadData(): void {
    if (!this.zwiftId()) return;

    this.loading.set(true);
    this.error.set(null);

    this.zwiftService.getCategoryData(236, this.zwiftId()!).subscribe({
      next: (res: any) => {
        if(res) {
          const cat = this.computeCategory(res[0].tCat);
          this.category.set(cat);
          this.pen.set(this.computePen(cat));

          this.loading.set(false);
        } else {
          this.error.set('Données indisponibles pour le moment.');
          this.loading.set(false);
        }
      },
      error: () => {
        this.error.set('Impossible de récupérer vos données.');
        this.loading.set(false);
      }
    });
  }

  // =====================================================
  // 🔥 RÈGLES MÉTIER CENTRALISÉES
  // =====================================================

  private computeCategory(tCat: string): Category {
    if (tCat == 'A') return 1;
    if (tCat == 'B') return 2;
    if (tCat == 'C') return 3;
    if (tCat == 'D') return 4;
    if (tCat == 'E') return 5;
    if (tCat == 'F') return 6;
    if (tCat == 'G') return 7;
    if (tCat == 'H')  return 8;
    if (tCat == 'I')  return 9;
    return 10;
  }

  private computePen(category: Category): Pen {
    if (category <= 2) return 'A';
    if (category <= 4) return 'B';
    if (category <= 6) return 'C';
    return 'D';
  }

  // =====================================================

  goToIdentification(): void {
    this.router.navigate(['/zw/identification']);
  }
}
