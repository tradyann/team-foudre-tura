import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { ZwiftService } from '../../zwift.service';
import { CommonModule } from '@angular/common';
import { DurationPipe } from '../../../../shared/pipes/duration.pipe';
import { LucideAngularModule, ListIcon, ListOrderedIcon, TimerOffIcon } from 'lucide-angular';


@Component({
  selector: 'app-stage-results',
  imports: [CommonModule, RouterLink, DurationPipe, LucideAngularModule, RouterLink],
  templateUrl: './stage-results.html',
  styleUrl: './stage-results.css'
})
export class StageResults {
  private route = inject(ActivatedRoute);
  private zwiftService = inject(ZwiftService);
  private router = inject(Router);

  // DATA
  results = signal<{ results: any[]; stageInfos?: any } | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  // PARAMS
  readonly competitionId = signal<number | null>(null);
  readonly category = signal<string>('E');
  readonly stageNumber = signal<number>(0);

  // INFOS STAGE PARSÉES
  stageInfos = computed(() => {
    const raw = this.results()?.stageInfos;
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  displayedResults = signal<any[]>([]);
  sortBySlot = signal(true);
  ListIcon = ListIcon;
  ListOrderedIcon = ListOrderedIcon;
  TimerOffIcon = TimerOffIcon;

  // EFFECT : when stageId or category change → call API
  constructor() {
    // 1) on suit les changements d'URL
    this.route.paramMap.subscribe((params: ParamMap) => {
      const compId = Number(params.get('competitionId'));
      const cat = params.get('category') ?? 'E';
      localStorage.setItem('favCat', cat);
      const stage = Number(params.get('stageNumber'));

      // UPDATE SIGNALS
      this.competitionId.set(compId);
      this.category.set(cat);
      this.stageNumber.set(stage);
    });

    // 2) on refetch quand stageId/category changent
    effect(() => {
      const id = this.competitionId();
      const cat = this.category();
      const stageNumber = this.stageNumber();

      if (!id || !cat || !stageNumber) {
        this.error.set('Missing stage, category or competition');
        this.loading.set(false);
        return;
      }

      this.loading.set(true);
      this.error.set(null);

      this.zwiftService.getStageResults(id, cat, stageNumber).subscribe({
        next: (data) => {
          this.results.set(data);
          this.applySort(); // <- affiche selon l'état actuel
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
  
  applySort() {
    let src = this.results()?.results ?? [];

    if (this.sortBySlot()) {
      // filtre les "missed"
      src = src.filter(r => !r.isMissed);

      // tri par slotNumber puis cGapNet
      src = [...src].sort((a, b) => {
        const sa = a.slotNumber ?? 999, sb = b.slotNumber ?? 999;
        if (sa !== sb) return sa - sb;

        const ea = a.cGapNet ?? 0, eb = b.cGapNet ?? 0;
        return ea - eb;
      });
    }

    this.displayedResults.set(src);
  }

  toggleSlotSort() {
    this.sortBySlot.update(v => !v);
    this.applySort();
  }

  // NAVIGATION — même style que CompetitionResults
  goToCategory(cat: string) {
    this.router.navigate(['/zw/stage-results', this.competitionId(), cat, this.stageNumber()]);
  }

  goToStageNumber(targetStageNumber: number | null | undefined) {
    if (!targetStageNumber) return;
    this.router.navigate(['/zw/stage-results', this.competitionId(), this.category(), targetStageNumber]);
  }

  // (optionnel) helpers si ton API expose stageNumber/lastStageNumber et prev/next id
  goPrev() {
    this.goToStageNumber(this.stageNumber() - 1);
  }
  goNext() {
    this.goToStageNumber(this.stageNumber() + 1);
  }

  goToPage(pageLink: string) {
    if(pageLink === '/zw/stage-results' && this.stageNumber() === 0) {
      this.stageNumber.set(1);
    }
    if(pageLink === '/game/competition') {
      this.router.navigate([pageLink, this.competitionId()]);
    } else {
      this.router.navigate([
        pageLink,
        this.competitionId(),
        this.category(),
        this.stageNumber(),
      ]);
    }
  }

  goToPageJersey(pageLink: string) {
    this.router.navigate([
      pageLink,
      this.competitionId(),
      this.category(),
      3, // sprint default 
      this.stageNumber(),
    ]);
  }

  goToZwiftPovwer(zwiftId: number) {
    window.open(`https://zwiftpower.com/profile.php?z=${zwiftId}`, '_blank');
  }
}