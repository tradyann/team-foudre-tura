import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class MultiTranslateHttpLoader implements TranslateLoader {
    constructor(
        private http: HttpClient,
        private prefix = '/assets/i18n',
        private suffix = '.json',
        private files: string[] = []
    ) {}

    getTranslation(lang: string): Observable<any> {
        const requests = this.files.map(file =>
        this.http.get(`${this.prefix}/${lang}/${file}${this.suffix}`)
        );

        return forkJoin(requests).pipe(
            map(responses => Object.assign({}, ...responses))
        );
    }
}
