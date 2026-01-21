// upload.service.ts
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UploadService {
    private http = inject(HttpClient);
    private baseUrl = environment.ApiBaseUrl;

    async presignV2(
        file: File,
        kind: 'video' | 'fit' | 'image' | 'log',
        meta?: Record<string, string>
    ): Promise<{ key: string; url: string; requiredHeaders: Record<string, string>; maxBytes: number }> {
        const body = {
        fileName: file.name,
        contentType: file.type || 'application/octet-stream',
        kind,
        meta
        };

        const url = `${this.baseUrl.replace(/\/$/, '')}/api/storage/presign-v2`;

        return firstValueFrom(
        this.http.post<{
            key: string;
            url: string;
            requiredHeaders: Record<string, string>;
            maxBytes: number;
        }>(url, body)
        );
    }

    uploadWithProgress(
        file: File,
        url: string,
        headers: Record<string, string>,
        onProgress: (p: number) => void
    ) {
        return new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onerror = () => reject(new Error('upload failed'));
        xhr.onload = () =>
            xhr.status >= 200 && xhr.status < 300
            ? resolve()
            : reject(new Error(xhr.statusText));
        xhr.open('PUT', url, true);
        Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
        xhr.send(file);
        });
    }

    getAllUploads(): Observable<any> {
        return this.http.get(this.baseUrl + 'api/storage/my-uploads');
    }

    async viewUrlBySecret(secretKey: string): Promise<{ url: string; expiresUtc: string }> {
        return firstValueFrom(
        this.http.get<{ url: string; expiresUtc: string }>(this.baseUrl + 'api/storage/view-url', {
            params: { secretKey }
        })
        );
    }

    async downloadUrlBySecret(secretKey: string): Promise<{ url: string; expiresUtc: string }> {
        return firstValueFrom(
        this.http.get<{ url: string; expiresUtc: string }>(this.baseUrl + 'api/storage/download-url', {
            params: { secretKey }
        })
        );
    }
}
