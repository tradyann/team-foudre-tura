import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export type Lang =
  | 'en'
  | 'fr'
  | 'es'
  | 'de'
  | 'it'
  | 'pt-pt'
  | 'pt-br';

@Injectable({ providedIn: 'root' })
export class LanguageService {

  private translate = inject(TranslateService);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  // 🔥 langue persistée
  private readonly _lang = signal<Lang>(
    (typeof window !== 'undefined'
      ? (localStorage.getItem('lang') as Lang)
      : null) || 'en'
  );

  // 🔥 exposée en lecture seule
  readonly lang = this._lang.asReadonly();

  constructor() {
    // initialisation ngx-translate
    this.translate.setDefaultLang(this._lang());
    this.translate.use(this._lang());

    if (isPlatformBrowser(this.platformId)) {
      this.document.documentElement.lang = this._lang();
    }
  }

  /** Change la langue globalement + persistance */
  setLang(lang: Lang): void {
    if (this._lang() === lang) return;

    this._lang.set(lang);
    this.translate.use(lang);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lang', lang);
      this.document.documentElement.lang = lang;
    }
  }
}
