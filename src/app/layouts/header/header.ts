import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../features/user/user.service';
import { debounceTime, distinctUntilChanged, filter, Subject, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  readonly theme = signal<'light' | 'dark'>('light');
  searchString: string = '';
  private searchSubject = new Subject<string>();
  private searchSub: Subscription;
  router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  isOpen = signal(false);

  // Signal du titre affiché
  title = signal('Dashboard');

  constructor(private userService: UserService) {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      this.theme.set(saved === 'dark' ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', this.theme());

      // ✅ encapsule le effect DANS if browser
      effect(() => {
        const val = this.theme();
        localStorage.setItem('theme', val);
        document.documentElement.setAttribute('data-theme', val);
      });
    }

    // Subscribe to the search observable
    this.searchSub = this.searchSubject.pipe(
      debounceTime(1000),                    // Wait 1 sec after typing stops
      distinctUntilChanged(),                // Ignore same value
      filter(value => value.trim().length >= 3) // Min 3 characters
    ).subscribe((searchTerm: string) => {
      this.reqSearch(searchTerm);
    });
  }

  ngOnInit() {
    this.setTitleFromCurrentRoute();

    const sub = this.router.events.subscribe(() => {
      this.setTitleFromCurrentRoute();
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  toggleTheme(): void {
    this.theme.update(t => t === 'dark' ? 'light' : 'dark');
  }

  onLogout(): void {
    this.userService.logout();
  }
  
  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  reqSearch(value: string): void {
    this.router.navigate(['/search-result', value]);
  }

  private setTitleFromCurrentRoute() {
    let r = this.route;
    while (r.firstChild) r = r.firstChild;

    const dataTitle = r.snapshot.data?.['title'];
    this.title.set(dataTitle || null); // si absent -> null
  }

  // signal pour la langue
  lang = signal<'en' | 'fr' | 'de' | 'es' | 'it' | 'pt'| 'br'>(
    (localStorage.getItem('lang') as any) || 'en'
  );

  /** Ferme tous les dropdowns sauf celui passé */
  private closeOther(current: HTMLDetailsElement) {
    document.querySelectorAll<HTMLDetailsElement>('details.dropdown[open]').forEach(el => {
      if (el !== current) el.removeAttribute('open');
    });
  }

  goToPage(dd: HTMLDetailsElement, url: string) {
    this.closeOther(dd); // ferme les autres aussi
    dd.removeAttribute('open'); // ferme celui-ci
    (document.activeElement as HTMLElement)?.blur();
    this.router.navigate([url]);
  }

  changeLang(detailsEl: HTMLDetailsElement, l: 'en' | 'fr' | 'de' | 'es' | 'it' | 'pt'| 'br') {
    this.closeOther(detailsEl); // ferme les autres aussi
    this.lang.set(l);
    localStorage.setItem('lang', l);
    // this.translate.use(l); // si tu utilises ngx-translate
    detailsEl.removeAttribute('open'); // ferme le dropdown cliqué
  }

  /** Appelé dans (click) des <summary> */
  onOpen(dd: HTMLDetailsElement) {
    this.closeOther(dd);
  }
}
