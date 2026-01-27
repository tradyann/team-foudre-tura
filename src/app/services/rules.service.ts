import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RulesService {

  constructor(private http: HttpClient) {}

  /**
   * Normalise la langue ngx-translate vers le nom de fichier
   * ex:
   *  - fr-FR → fr
   *  - en-US → en
   *  - pt-BR → pt-br
   *  - pt-PT → pt-pt
   */
  private normalizeLang(lang: string): string {
    if (!lang) return 'en';

    const lower = lang.toLowerCase();

    if (lower.startsWith('pt-')) {
      return lower; // pt-pt / pt-br
    }

    return lower.split('-')[0]; // fr-FR → fr
  }

  load(lang: string): Observable<string> {
    const normalized = this.normalizeLang(lang);

    return this.http.get(
      `/assets/rules/rules.${normalized}.md`,
      { responseType: 'text' }
    );
  }

  /**
   * Chargement avec fallback EN
   */
  loadWithFallback(lang: string): Observable<string> {
    return this.load(lang).pipe(
      catchError(err => {
        console.warn(
          `[Rules] Missing rules for lang "${lang}", fallback to EN`
        );
        return this.load('en');
      })
    );
  }
}
