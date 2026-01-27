import { Component, inject, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MarkdownComponent } from 'ngx-markdown';
import { RulesService } from '../../../services/rules.service';

@Component({
  selector: 'app-rules',
  imports: [
    CommonModule,
    TranslateModule,
    MarkdownComponent
  ],
  templateUrl: './rules.html',
  styleUrl: './rules.css'
})
export class Rules {

  private rulesService = inject(RulesService);
  private translate = inject(TranslateService);

  // ✅ signal pour le contenu markdown
  contentMarkdown = signal<string>('');

  // ✅ signal pour la langue courante
  currentLang = signal(this.translate.currentLang || 'en');

  constructor() {

    // 🔁 sync ngx-translate → signal
    this.translate.onLangChange.subscribe(e => {
      this.currentLang.set(e.lang);
    });

    // ⚡ effect = reload auto
    effect(() => {
      const lang = this.currentLang();
      this.rulesService.loadWithFallback(lang).subscribe(md => {
        this.contentMarkdown.set(md);
      });
    });
  }
}
