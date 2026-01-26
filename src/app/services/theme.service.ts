import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    readonly theme = signal<'light' | 'dark'>('light');

    constructor() {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            this.theme.set(saved === 'dark' ? 'dark' : 'light');
            document.documentElement.setAttribute('data-theme', this.theme());
        }
    }

    toggleTheme(): void {
        const next = this.theme() === 'dark' ? 'light' : 'dark';
        this.theme.set(next);

        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', next);
            document.documentElement.setAttribute('data-theme', next);
        }
    }
}
