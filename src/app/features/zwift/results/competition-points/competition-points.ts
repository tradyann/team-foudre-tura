import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { ZwiftService } from '../../zwift.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-competition-points',
  imports: [CommonModule, RouterLink],
  templateUrl: './competition-points.html',
  styleUrl: './competition-points.css'
})
export class CompetitionPoints {
  private route = inject(ActivatedRoute);
  private zwiftService = inject(ZwiftService);
  private router = inject(Router);

  // SIGNALS
  results = signal<{ 
    results: any[]; 
    competitionInfos?: any, 
    jerseyInfos?: any[], 
    lastStageNumber: number 
  } | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  // SIGNALS FOR ROUTE PARAMETERS
  readonly competitionId = signal<number | null>(null);
  readonly category = signal<string>('E');
  readonly jerseyId = signal<number | null>(null);
  readonly stageNumber = signal<number>(0);

  // COMPUTED SIGNAL FOR COMPETITION INFOS
  competitionInfos = computed(() => {
    const raw = this.results()?.competitionInfos;
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

  constructor() {
     // SUBSCRIBE TO ROUTE PARAMETER CHANGES
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


      if (!id || !cat || !jerseyId) {
        this.error.set('Missing stage, category, competition or jersey');
        this.loading.set(false);
        return;
      }

      this.loading.set(true);
      this.error.set(null);

      this.zwiftService.getCompetitonPoints(id, cat, stageNumber, jerseyId).subscribe({
        next: (data) => {
          this.results.set(data);
          this.loading.set(false);
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

  goToCategory(cat: string) {
    this.router.navigate([
      '/zw/competition-points',
      this.competitionId(),
      cat,
      this.jerseyId(),
      this.stageNumber(),
    ]);
  }

  goToStage(stage: number) {
    this.router.navigate([
      '/zw/competition-points',
      this.competitionId(),
      this.category(),
      this.jerseyId(),
      stage,
    ]);
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
        '/zw/competition-results', 
        this.competitionId(), 
        this.category(),
        this.stageNumber() || 1
      ]);
    } else {
      this.router.navigate([
        '/zw/competition-points/',
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