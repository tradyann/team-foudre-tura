import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../../shared/services/upload.service';

type Item = {
  uploadId: number;
  idClient: number;
  objectUrl: string;
  uploadType: number;     // 1 fit, 2 video, 3 image, 4 log
  uploadDate: string;
  secretKey: string;
};

@Component({
  selector: 'app-upload-files',
  imports: [CommonModule],
  templateUrl: './upload-files.html',
  styleUrl: './upload-files.css'
})
export class UploadFiles {
  private up = inject(UploadService);

  items = signal<Item[]>([]);
  error = signal<string | null>(null);
  loading = signal(false);

  // Preview state
  previewUrl = signal<string | null>(null);
  previewExpires = signal<Date | null>(null);
  previewKind = signal<number | null>(null); // 2=video, 3=image
  previewingItem = signal<Item | null>(null);

  ngOnInit() {
    this.load();
  }

  load() {
    this.up.getAllUploads().subscribe({
        next: (data) => {
          this.items.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Error loading results');
          console.error(err);
          this.loading.set(false);
        }
      });
  }

  kindLabel(kind: number) { return {1:'FIT',2:'VIDEO',3:'IMAGE',4:'LOG'}[kind] ?? String(kind); }

  async preview(it: Item) {
    try {
      this.error.set(null);
      this.previewUrl.set(null);
      this.previewExpires.set(null);
      this.previewKind.set(null);
      this.previewingItem.set(it);

      if (!it.secretKey) throw new Error('No secretKey for this item.');
      const { url, expiresUtc } = await this.up.viewUrlBySecret(it.secretKey);

      this.previewUrl.set(url);
      this.previewExpires.set(new Date(expiresUtc));
      this.previewKind.set(it.uploadType); // 2=video, 3=image
    } catch (e: any) {
      this.error.set(e?.message || 'Preview failed');
    }
  }

  async download(it: Item) {
    try {
      this.error.set(null);
      if (!it.secretKey) throw new Error('No secretKey for this item.');
      const { url } = await this.up.downloadUrlBySecret(it.secretKey);

      // Démarre le download (ouvre dans un nouvel onglet ou forcer <a download>)
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.click();
      a.remove();
    } catch (e: any) {
      this.error.set(e?.message || 'Download failed');
    }
  }

  // Optionnel : auto-refresh si l’URL preview expire et provoque une erreur
  onVideoError(ev: Event, videoEl: HTMLVideoElement) {
    // Essaie de regénérer une URL si le code erreur indique une source expirée
    // (les navigateurs exposent peu d’infos; on peut juste recharger la preview)
    const it = this.previewingItem();
    if (it && (this.previewKind() === 2 || this.previewKind() === 3)) {
      this.preview(it);
      // si vidéo: relancer la lecture après refresh
      setTimeout(() => { if (videoEl) videoEl.play?.(); }, 300);
    }
  }

  clearPreview() {
    this.previewUrl.set(null);
    this.previewExpires.set(null);
    this.previewKind.set(null);
    this.previewingItem.set(null);
  }
}