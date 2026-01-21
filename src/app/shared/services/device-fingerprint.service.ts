import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed, inject } from '@angular/core';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DeviceFingerprintService {   
    private _visitorId = signal<string | null>(null);
    private _started = false;

    private http = inject(HttpClient);
    private baseUrl = environment.ApiBaseUrl;

    async start(): Promise<void> {
        if (this._started) return;
        this._started = true;

        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const newId = result.visitorId;

        const storedId = localStorage.getItem('fpusr');

        if (!storedId || storedId !== newId) {
        localStorage.setItem('fpusr', newId);

        // fire-and-forget
        this.http
            .post(`${this.baseUrl}api/profile/device-register`, { fingerprintId: newId })
            .subscribe({
            next: () => {},
            error: (err) => {
                console.warn('Device register failed', err);
            },
            });
        }

        this._visitorId.set(newId);
    }

    readonly visitorId = computed(() => this._visitorId());
}
