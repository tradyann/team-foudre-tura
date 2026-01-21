import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { ZwiftService } from '../../zwift.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stage-points',
  imports: [CommonModule, RouterLink],
  templateUrl: './stage-points.html',
  styleUrl: './stage-points.css'
})
export class StagePoints {
  private route = inject(ActivatedRoute);
  private zwiftService = inject(ZwiftService);
  private router = inject(Router);

  // PARAMS
  readonly competitionId = signal<number | null>(null);
  readonly category = signal<string>('E');
  readonly jerseyId = signal<number | null>(null);
  readonly stageNumber = signal<number>(0);

  // DATA
  results = signal<{
    results: any[],
    stageInfos?: string,
    jerseyInfos?: any[]
  } | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  stageInfos = computed(() => {
    const raw = this.results()?.stageInfos;
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  jerseyInfos = computed(() => {
    const raw = this.results()?.jerseyInfos;
    if (!raw) return null;
    if (Array.isArray(raw)) return raw; // déjà un tableau
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  selectedJerseyId = signal<number | null>(null);

  groupedMode = signal(false);
  displayedResults = signal<any[]>([]);
  groupedBySlot = signal<{ slot: number; items: any[]; totalPoints: number }[]>([]);

  constructor() {
    // 1) on suit les changements d'URL
    this.route.paramMap.subscribe((params: ParamMap) => {
      const compId = Number(params.get('competitionId'));
      const cat = params.get('category') ?? 'E';
      localStorage.setItem('favCat', cat);
      const jerseyId = Number(params.get('jerseyId'));
      const stage = Number(params.get('stageNumber'));

      // UPDATE SIGNALS
      this.competitionId.set(compId);
      this.category.set(cat);
      this.jerseyId.set(jerseyId);
      this.stageNumber.set(stage);

      // reflète l’URL dans le select
      this.selectedJerseyId.set(Number.isFinite(jerseyId) ? jerseyId : null);
    });

    effect(() => {
      const id = this.competitionId();
      const cat = this.category();
      const jerseyId = this.jerseyId();
      const stageNumber = this.stageNumber();

      if (!id || !cat || !stageNumber || !jerseyId) {
        this.error.set('Missing stage, category, competition or jersey');
        this.loading.set(false);
        return;
      }

      this.loading.set(true);
      this.error.set(null);

      this.zwiftService.getStagePoints(id, cat, jerseyId, stageNumber).subscribe({
        next: (data) => {
          //console.log(data)
          this.results.set(data);
          this.loading.set(false);
          this.applyView(); // <= recalcul vue
          // si l’URL n’avait pas de jersey, prends celui marqué isSelected
          if (!this.selectedJerseyId()) {
            try {
              const arr = Array.isArray(data.jerseyInfos)
                ? data.jerseyInfos
                : JSON.parse(data.jerseyInfos ?? '[]');
              const pre = arr?.find((j: any) => j.isSelected)?.id;
              if (pre) this.selectedJerseyId.set(pre);
            } catch {}
          }
        },
        error: (err) => {
          this.error.set('Error loading results');
          console.error(err);
          this.loading.set(false);
        }
      });
    });
  }

  applyView() {
    const src = this.results()?.results ?? [];

    if (!this.groupedMode()) {
      // mode normal: tout, tel quel
      this.displayedResults.set(src);
      this.groupedBySlot.set([]);
      return;
    }

    // mode groupé: sans "missed", tri par slot puis points desc
    const clean = src.filter(r => !r.isMissed);
    clean.sort((a, b) => {
      const sa = (a.slotNumber ?? 999) - (b.slotNumber ?? 999);
      if (sa !== 0) return sa;
      return (b.totalPoints ?? 0) - (a.totalPoints ?? 0);
    });

    const m = new Map<number, any[]>();
    for (const r of clean) {
      const s = r.slotNumber ?? 0;
      if (!m.has(s)) m.set(s, []);
      m.get(s)!.push(r);
    }

    const groups = Array.from(m.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([slot, items]) => ({
        slot,
        items,
        totalPoints: items.reduce((sum, x) => sum + (x.totalPoints ?? 0), 0),
      }));

    this.displayedResults.set(clean); // optionnel si tu veux encore l’utiliser
    this.groupedBySlot.set(groups);
  }

  toggleGrouped() {
    this.groupedMode.update(v => !v);
    this.applyView();
  }

   // NAVIGATION — même style que CompetitionResults
  goToCategory(cat: string) {
    this.router.navigate(['/zw/stage-points/', this.competitionId(), cat, this.jerseyId(), this.stageNumber()]);
  }

  goToStageNumber(targetStageNumber: number | null | undefined) {
    if (!targetStageNumber) return;
    this.router.navigate(['/zw/stage-points/', this.competitionId(), this.category(), this.jerseyId(), targetStageNumber]);
  }

  // (optionnel) helpers si ton API expose stageNumber/lastStageNumber et prev/next id
  goPrev() {
    this.goToStageNumber(this.stageNumber() - 1);
  }
  goNext() {
    this.goToStageNumber(this.stageNumber() + 1);
  }

  onSelectJersey(jerseyId: number) {
    // garde la valeur locale pour mettre à jour le select
    this.selectedJerseyId.set(jerseyId);
    // navigue avec le nouvel id
    this.router.navigate([
      '/zw/stage-points/',
      this.competitionId(),
      this.category(),
      jerseyId,
      this.stageNumber() || 1
    ]);
  }

  onSelectIndex(evt: Event) {
    const idx = (evt.target as HTMLSelectElement).selectedIndex;
    //console.log(idx);
    this.selectedJerseyId.set(this.jerseyInfos()[idx].jerseyId);
    if(this.selectedJerseyId() === 1) {
      this.router.navigate([
        '/zw/stage-results', 
        this.competitionId(), 
        this.category(),
        this.stageNumber() || 1
      ]);
    } else {
      this.router.navigate([
        '/zw/stage-points/',
        this.competitionId(),
        this.category(),
        this.selectedJerseyId(),
        this.stageNumber() || 1
      ]);
      }

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
}