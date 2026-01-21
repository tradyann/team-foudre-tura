import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex gap-2">
      <button class="btn btn-sm btn-outline" [class.btn-active]="currentLang === 'fr'" (click)="switchLang('fr')" aria-label="🇫🇷">🇫🇷</button>
      <button class="btn btn-sm btn-outline" [class.btn-active]="currentLang === 'en'" (click)="switchLang('en')" aria-label="🇬🇧">🇬🇧</button>
    </div>
  `
})
export class LanguageSwitcherComponent {
  private router = inject(Router);
  private translate = inject(TranslateService);

  currentLang = this.translate.currentLang || 'fr';

  switchLang(lang: 'fr' | 'en') {
    const currentUrl = this.router.url;
    const segments = currentUrl.split('/').filter(Boolean); // ['fr', 'blog'] ou ['blog']
  
    // Si première partie est une langue, on la retire
    if (['fr', 'en'].includes(segments[0])) {
      segments.shift();
    }
  
    // Si nouvelle langue est EN, on l’ajoute en préfixe
    const newSegments = lang === 'fr' ? segments : [lang, ...segments];
  
    const newUrl = '/' + newSegments.join('/');
  
    this.translate.use(lang);
    this.currentLang = lang;
    this.router.navigateByUrl(newUrl);
  }
}
