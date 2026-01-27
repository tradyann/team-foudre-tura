import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ZwiftService } from '../../zwift.service';
import { CommonModule } from '@angular/common';
import { DurationPipe } from '../../../../shared/pipes/duration.pipe';
import { LucideAngularModule, TimerOffIcon } from 'lucide-angular';

@Component({
  selector: 'app-competition-results',
  imports: [CommonModule, DurationPipe, LucideAngularModule],
  templateUrl: './competition-results.html',
  styleUrl: './competition-results.css'
})
export class CompetitionResults {
  private route = inject(ActivatedRoute);
  private zwiftService = inject(ZwiftService);
  private router = inject(Router);

  // SIGNALS
  results = signal<{ results: any[]; competitionInfos?: any, lastStageNumber: number } | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  // SIGNALS FOR ROUTE PARAMETERS
  readonly competitionId = signal<number | null>(null);
  readonly category = signal<string>('E');
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

  TimerOffIcon = TimerOffIcon;

  constructor() {
     // SUBSCRIBE TO ROUTE PARAMETER CHANGES
    this.route.paramMap.subscribe((params: ParamMap) => {
      const compId = Number(params.get('competitionId'));
      const cat = params.get('category') ?? 'E';
      const stage = Number(params.get('stageNumber'));

      // UPDATE SIGNALS
      this.competitionId.set(compId);
      this.category.set(cat);
      this.stageNumber.set(stage);
    });
    
    effect(() => {
      const id = this.competitionId();
      const cat = this.category();
      const stageNumber = this.stageNumber();

      if (!id || !cat) {
        this.error.set('Missing competitionId or category');
        this.loading.set(false);
        return;
      }

      this.loading.set(true);
      this.error.set(null);

      this.zwiftService.getCompetitonResults(id, cat, stageNumber).subscribe({
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

  goToCategory(cat: string) {
    this.router.navigate([
      '/zw/competition-results',
      this.competitionId(),
      cat,
      this.stageNumber(),
    ]);
  }

  goToStage(stage: number) {
    this.router.navigate([
      '/zw/competition-results',
      this.competitionId(),
      this.category(),
      stage,
    ]);
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