import { HttpClient } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { importProvidersFrom } from '@angular/core';
import { MultiTranslateHttpLoader } from './services/multi-translate-loader';

export function createTranslateLoader(http: HttpClient) {
    return new MultiTranslateHttpLoader(
        http,
        '/assets/i18n',
        '.json',
        [
            'common',
            'upload'
        ]
    );
}

export const translationProviders = [
    provideHttpClient(),
    importProvidersFrom(
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        })
    ),
];
