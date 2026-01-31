import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ZwiftService } from '../zwift/zwift.service';
import { LucideAngularModule, ShirtIcon} from 'lucide-angular';
import { Jersey } from '../../shared/jersey/jersey';
import { TranslateModule } from '@ngx-translate/core';

interface UpcomingCompetition {
  competitionId: number;
  competitionName: string;
  fromDate: Date;
  toDate: Date;
  typeCompetition: string;
  accessType: number;
  isClosed: boolean;
  stagesCount: string;
  eventClassName: string;
  timeNeutralLimit: number;
  banner: string;
}

interface JerseyLeader {
  jerseyId: number;
  jerseyKey: string;
  zwiftId: number;
  idClient: number;
  racerName: string;
  category: string;
  value: number;
  valueKind: string;
}

interface CategoryLeaders {
  catId: number;
  category: string;
  jerseyGC: string;
  colorGC: string;
  isPolka: boolean;
  leaders: JerseyLeader[];
}

interface CompetitionDetails {
  competitionId: number;
  competitionName: string;
  fromDate: string;
  toDate: string;
  typeCompetition: string;
  colorId: number;
  gcVariant: string;
  climberVariant: string;
  sprinterVariant: string;
  gcFillColor: string;
  climberFillColor: string;
  sprinterFillColor: string;
  gcSecondColor: string;
  climberSecondColor: string;
  sprinterSecondColor: string;
  categories: CategoryLeaders[];
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, LucideAngularModule, Jersey, TranslateModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  private router = inject(Router);
  zwiftService = inject(ZwiftService);
  activeIndex = signal(0);

  // SIGNALS
  competition = signal<CompetitionDetails[] | null>([]);
  competitionLoading = signal(true);
  upcoming = signal<UpcomingCompetition[]>([]);
  upcomingLoading = signal(true);
  error = signal<string | null>(null);

  ShirtIcon = ShirtIcon;

//   CompetitionDetailsMocked: CompetitionDetails[] = [
//   {
//     competitionId: 236,
//     competitionName: "La Cyclo MedioFondo Foudre - Age & Women categories⚡️!",
//     fromDate: "2026-01-01T00:00:00",
//     toDate: "2026-02-02T00:00:00",
//     typeCompetition: "Tour",

//     colorId: 1,

//     gcVariant: "full",
//     climberVariant: "polka",
//     sprinterVariant: "full",

//     gcFillColor: "#3abdf7",
//     gcSecondColor: "#000000",

//     climberFillColor: "white",
//     climberSecondColor: "red",

//     sprinterFillColor: "#16A34A",
//     sprinterSecondColor: "#0F5132",

//     categories: [
//       {
//         catId: 6,
//         category: "F",
//         jerseyGC: "GC",
//         colorGC: "#FACC15",
//         isPolka: false,
//         leaders: [
//           {
//             jerseyId: 1,
//             jerseyKey: "GC",
//             zwiftId: 121766,
//             idClient: 0,
//             racerName: "Neil Gardiner",
//             category: "F",
//             value: -5,
//             valueKind: "sumGapNet"
//           },
//           {
//             jerseyId: 3,
//             jerseyKey: "KOM",
//             zwiftId: 5398458,
//             idClient: 0,
//             racerName: "Filou Canyon",
//             category: "F",
//             value: 0,
//             valueKind: "sumTotalPoints"
//           }
//         ]
//       },

//       {
//         catId: 1,
//         category: "A",
//         jerseyGC: "GC",
//         colorGC: "#FACC15",
//         isPolka: false,
//         leaders: [
//           {
//             jerseyId: 1,
//             jerseyKey: "GC",
//             zwiftId: 1839454,
//             idClient: 0,
//             racerName: "Matteo CrosaLenz",
//             category: "A",
//             value: -10,
//             valueKind: "sumGapNet"
//           }
//         ]
//       }
//     ]
//   }
// ];


  categories = computed(() => {
    const comp = this.competition()?.[0];
    return comp?.categories ?? [];
  });

  categoriesSorted = computed(() => {
    return [...this.categories()].sort((a, b) => a.catId - b.catId);
  });

  ngOnInit() {
    const seen = localStorage.getItem('hasSeenWelcome');
    if (!seen) {
      localStorage.setItem('hasSeenWelcome', 'true');
      this.router.navigate(['/welcome']);
    }
    this.loadCompetitions();
    this.loadJerseys();
    // setInterval(() => this.next(), 6000); // 6s
  }

  loadCompetitions() {
    this.zwiftService.getHomeCompetitions().subscribe(
      {
        next: (data) => {
          this.upcoming.set(data);
          this.upcomingLoading.set(false);
          //console.log('competitions', data);
        },
        error: (err) => {
          this.error.set('Error loading results');
          console.error(err);
          this.upcomingLoading.set(false);
        }
      }
    )
  }
  
  loadJerseys() {
    this.zwiftService.getHomeJerseys(235).subscribe(
      {
        next: (data) => {
          // mock here!!!
          //this.competition.set(this.CompetitionDetailsMocked);
          this.competition.set(data);
          
          this.competitionLoading.set(false);
          console.log('jerseys', data);
        },
        error: (err) => {
          this.error.set('Error loading results');
          console.error(err);
          this.competitionLoading.set(false);
        }
      }
    )
  }

  goTo(i: number) {
    const n = this.upcoming().length;
    this.activeIndex.set(((i % n) + n) % n); // wrap
  }
  prev() { this.goTo(this.activeIndex() - 1); }
  next() { this.goTo(this.activeIndex() + 1); }


  goToZwiftPovwer(zwiftId: number) {
    window.open(`https://zwiftpower.com/profile.php?z=${zwiftId}`, '_blank');
  }

  // upcoming = signal<UpcomingCompetition[]>([
  //   {
  //     id: 'bf-07',
  //     name: 'Battle Foudre — Stage 7',
  //     world: 'Watopia',
  //     route: 'Figure 8',
  //     startDates: { EU: '2025-09-05T18:30:00Z', NA: '2025-09-05T23:30:00Z', ASIA: '2025-09-06T11:30:00Z' },
  //     tags: ['GC', 'FAL', 'FTS'],
  //     banner: '/images/worlds/watopia004.jpg',
  //     ctaLink: '/events/bf-07',
  //     blurb: 'Multi-slot GC with sprint and KOM segments. Team and individual rankings.',
  //   },
  //   {
  //     id: 'zrl-autumn-1',
  //     name: 'ZRL — Autumn Opener',
  //     world: 'Makuri Islands',
  //     route: 'Neokyo Crit',
  //     startDates: { EU: '2025-09-10T18:00:00Z', NA: '2025-09-11T01:00:00Z', ASIA: '2025-09-11T10:00:00Z' },
  //     tags: ['Teams', 'Points', 'Primes'],
  //     banner: '/images/worlds/watopia008.jpg',
  //     ctaLink: '/events/zrl-autumn-1',
  //     blurb: 'Fast crit opener with heavy team tactics and primes.',
  //   },
  //   {
  //     id: 'ecro-chasing-12',
  //     name: 'ECRO Chasing — #12',
  //     world: 'France',
  //     route: 'Casse-Pattes',
  //     startDates: { EU: '2025-09-14T17:30:00Z', NA: '2025-09-14T23:00:00Z', ASIA: '2025-09-15T10:30:00Z' },
  //     tags: ['Chasing', 'Handicap'],
  //     banner: '/images/worlds/watopia002.jpg',
  //     ctaLink: '/events/ecro-chasing-12',
  //     blurb: 'Handicap format with staggered starts; close gaps and hold your lead.',
  //   },
  // ]);

}