import { Injectable, inject } from '@angular/core';
import { LanguageService, Lang } from './language.service';

@Injectable({ providedIn: 'root' })
export class LangLinkService {

  private langService = inject(LanguageService);

  /** Change uniquement la langue (sans toucher à l’URL) */
  changeLang(lang: Lang): void {
    this.langService.setLang(lang);
  }
}
