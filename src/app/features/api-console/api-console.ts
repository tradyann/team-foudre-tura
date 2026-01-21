import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { SharedService } from '../../core/services/shared.service';

@Component({
  standalone: true,
  selector: 'app-api-console',
  imports: [CommonModule, FormsModule],
  templateUrl: './api-console.html',
  styleUrls: ['./api-console.css'],
})
export class ApiConsole {
  baseUrl = environment.ApiBaseUrl;

  sharedService = inject(SharedService);
  
  methods = ['GET','POST','PUT','PATCH','DELETE'] as const;

  // form
  method = signal<typeof this.methods[number]>('GET');
  urlInput = signal<string>(`${this.baseUrl}api/profile/racer-details`);
  body = signal<string>('{\n  "example": true\n}');
  bodyError = signal<string | null>(null);

  // ui
  busy = signal(false);
  copyState = signal<'idle'|'ok'|'err'>('idle');

  // response
  respStatus = signal<number | null>(null);
  respStatusText = signal<string>('');
  respText = signal<string>('');
  respPrettyJSON = signal<string>(''); // JSON indenté si parse OK

  async copyBearer() {
    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken') || '';
      await navigator.clipboard.writeText(token);
      this.copyState.set('ok');
    } catch {
      this.copyState.set('err');
    } finally {
      setTimeout(() => this.copyState.set('idle'), 1200);
    }
  }

  prettifyBody() {
    try { this.body.set(JSON.stringify(JSON.parse(this.body()), null, 2)); this.bodyError.set(null); }
    catch(e:any){ this.bodyError.set('Invalid JSON: '+(e?.message||e)); }
  }
  minifyBody() {
    try { this.body.set(JSON.stringify(JSON.parse(this.body()))); this.bodyError.set(null); }
    catch(e:any){ this.bodyError.set('Invalid JSON: '+(e?.message||e)); }
  }

  send() {
    this.busy.set(true);

    const method = this.method();
    const url = this.urlInput();
    let body: any = undefined;

    // Autoriser body pour tous sauf GET et DELETE sans body
    if (['POST','PUT','PATCH','DELETE'].includes(method) && this.body().trim()) {
      try {
        body = JSON.parse(this.body());
      } catch (e:any) {
        this.bodyError.set('Invalid JSON: ' + e.message);
        this.busy.set(false);
        return;
      }
    }

    this.sharedService.requestFromConsoleAPI(method, url, body)
      .subscribe({
        next: (res: any) => {
          this.respStatus.set(res.status);
          this.respStatusText.set(res.statusText || '');

          const text = res.body ?? '';
          this.respText.set(text);
          try {
            this.respPrettyJSON.set(JSON.stringify(JSON.parse(text), null, 2));
          } catch { this.respPrettyJSON.set(''); }

          this.busy.set(false);
        },
        error: (err) => {
          this.respStatus.set(err.status ?? null);
          this.respStatusText.set(err.statusText || err.message || '');

          const text = typeof err.error === 'string'
            ? err.error
            : JSON.stringify(err.error ?? {}, null, 2);

          this.respText.set(text);
          try {
            this.respPrettyJSON.set(JSON.stringify(JSON.parse(text), null, 2));
          } catch { this.respPrettyJSON.set(''); }

          this.busy.set(false);
        }
      });
  }
}
