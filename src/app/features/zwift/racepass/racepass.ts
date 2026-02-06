import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { ZwiftService } from '../zwift.service';
import { CommonModule } from '@angular/common';
import { ZwiftLinkState } from '../../../services/zwift-link.state';

@Component({
  selector: 'app-racepass',
  imports: [CommonModule, RouterLink],
  templateUrl: './racepass.html',
  styleUrl: './racepass.css'
})
export class Racepass {
  private route = inject(ActivatedRoute);
  private zwiftService = inject(ZwiftService);
  zwiftLinkState = inject(ZwiftLinkState);

  isZwiftLinked = () => this.zwiftLinkState.isLinked();

    // SIGNALS
  datas = signal<any | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  // SIGNALS FOR ROUTE PARAMETERS
  readonly competitionId = signal<number | null>(null);
  readonly stageId = signal<number>(0);

  constructor() {
     // SUBSCRIBE TO ROUTE PARAMETER CHANGES
    this.route.paramMap.subscribe((params: ParamMap) => {
      const compId = Number(params.get('competitionId'));
      const stageId = Number(params.get('stageId'));

      // UPDATE SIGNALS
      this.competitionId.set(compId);
      this.stageId.set(stageId);
    });
    
    effect(() => {
      const competitionId = this.competitionId();
      const stageId = this.stageId();

      if (!competitionId || !stageId) {
        this.error.set('Missing competitionId or stageId');
        this.loading.set(false);
        return;
      }

      this.loading.set(true);
      this.error.set(null);

      this.zwiftService.getRacepass(competitionId, stageId).subscribe({
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
    });
  }
}
