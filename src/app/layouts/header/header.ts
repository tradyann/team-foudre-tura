import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../features/user/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Lang, LanguageService } from '../../services/language.service';
import { LangLinkService } from '../../services/lang-link.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  langService = inject(LanguageService);
  langLink = inject(LangLinkService);
  
  readonly lang = this.langService.lang;

  readonly theme = signal<'light' | 'dark'>('light');

  router = inject(Router);

  isOpen = signal(false);

  // Signal du titre affiché
  title = signal('Dashboard');

  getFlag(lang: string): string {
    // issue with different names for flags
    switch (lang) {
      case 'pt-pt': return 'pt';
      case 'pt-br': return 'br';
      case 'sv': return 'se';
      default: return lang;
    }
  }

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
  }

  toggleTheme(): void {
    this.theme.update(t => t === 'dark' ? 'light' : 'dark');
  }

  onLogout(): void {
    this.userService.logout();
  }

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

  async changeLang(dropdown: HTMLDetailsElement, lang: Lang) {
    this.langLink.changeLang(lang);
    dropdown.removeAttribute('open');
  }

  /** Appelé dans (click) des <summary> */
  onOpen(dd: HTMLDetailsElement) {
    this.closeOther(dd);
  }
}
