import { Component, inject, signal } from '@angular/core';
import { ZwiftService } from '../zwift.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registered',
  imports: [CommonModule],
  templateUrl: './registered.html',
  styleUrl: './registered.css'
})
export class Registered {
  zwiftService = inject(ZwiftService);

  datas = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.zwiftService.getCompetitionRegistered(236).subscribe({
      next: (data) => {
          this.datas.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Error loading results');
          console.error(err);
          this.loading.set(false);
        }
      });
  }

  catNumber(cat: string): number | null {
    return {
      A: 1,
      B: 2,
      C: 3,
      D: 4,
      E: 5,
      F: 6,
      G: 7
    }[cat] ?? null;
  }

  isNewCategory(index: number): boolean {
    if (index === 0) return true;
    return this.datas()[index].tCat !== this.datas()[index - 1].tCat;
  }

  catLabel(cat: string): string {
    const n = this.catNumber(cat);
    return `Category ${n}`;
  }
  
}
