import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../../../shared/services/upload.service';

type Kind = 'video' | 'fit' | 'image' | 'log';

@Component({
  selector: 'app-file-upload',
  imports: [CommonModule],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.css'
})
export class FileUpload {
  private up = inject(UploadService);

  // UI state
  kind = signal<Kind>('video');                 // default
  selectedFile = signal<File | null>(null);
  progress = signal(0);
  uploading = signal(false);
  doneKey = signal<string | null>(null);
  error = signal<string | null>(null);
  maxBytes = signal<number | null>(null);      // fourni par presign-v2
  requiredHeaders = signal<Record<string,string> | null>(null);

  // identification
  zwiftId = signal<number | null>(null);

  ngOnInit(): void {
    const storedZwiftId = localStorage.getItem('zwiftIdLinked');
    if (storedZwiftId) {
      this.zwiftId.set(+storedZwiftId);
    }
  }

  // accept mime selon kind
  accept = computed(() => {
    switch (this.kind()) {
      case 'video': return 'video/*';
      case 'fit':   return '.fit,application/octet-stream';
      case 'image': return 'image/*';
      case 'log':   return '.log,.txt,.csv,.json,.zip,.gz,text/*,application/json,application/zip,application/gzip';
    }
  });

  // Texte taille max
  maxLabel = computed(() => {
    const mb = this.maxBytes();
    if (!mb) return '';
    const val = Math.round(mb / (1024*1024));
    return `Max ~${val} MB`;
  });

  onKindChange(k: Kind, inputEl: HTMLInputElement) {
    this.kind.set(k);
    this.clearSelection(inputEl);
  }

  onPick(evt: Event, inputEl: HTMLInputElement) {
    const file = (evt.target as HTMLInputElement).files?.[0] || null;
    // reset UI à chaque (re)sélection
    this.progress.set(0);
    this.doneKey.set(null);
    this.error.set(null);
    this.uploading.set(false);
    this.requiredHeaders.set(null);
    this.maxBytes.set(null);

    this.selectedFile.set(file);
    // ne vide pas tout de suite l'input : on le vide après l’upload ou clear
  }

  async startUpload(inputEl: HTMLInputElement) {

    const zwiftId = this.zwiftId();
    if(!zwiftId){
      this.error.set('You must link your zwiftId before.');
      return;
    }

    const file = this.selectedFile();
    const kind = this.kind();
    if (!file) { this.error.set('No file selected.'); return; }

    // gardes-fous simples côté front (mime)
    if (kind === 'video' && !file.type.startsWith('video/')) {
      this.error.set('Please select a video file.');
      return;
    }
    if (kind === 'image' && !file.type.startsWith('image/')) {
      this.error.set('Please select an image file.');
      return;
    }

    this.uploading.set(true);
    this.progress.set(0);
    this.doneKey.set(null);
    this.error.set(null);

    try {
      // (optionnel) calcul sha256 pour FIT
      let meta: Record<string,string> | undefined;
      if (kind === 'fit') {
        const sha = await this.sha256Hex(file);
        meta = { sha256: sha };
      }

      // 1) presign-v2
      const ps = await this.up.presignV2(file, kind, meta, zwiftId.toString());
      this.maxBytes.set(ps.maxBytes);
      this.requiredHeaders.set(ps.requiredHeaders);

      // 2) contrôle taille max conseillée si renvoyée
      if (ps.maxBytes && file.size > ps.maxBytes) {
        throw new Error(`File too large. Max allowed is ~${Math.round(ps.maxBytes / (1024*1024))} MB.`);
      }

      // 3) upload
      await this.up.uploadWithProgress(file, ps.url, ps.requiredHeaders, p => this.progress.set(p));

      // 4) done
      this.doneKey.set(ps.key);
    } catch (e: any) {
      this.error.set(e?.message || 'Upload failed');
    } finally {
      this.uploading.set(false);
      // permet de re-choisir le même fichier ensuite
      inputEl.value = '';
    }
  }

  clearSelection(inputEl: HTMLInputElement) {
    this.selectedFile.set(null);
    this.progress.set(0);
    this.doneKey.set(null);
    this.error.set(null);
    this.maxBytes.set(null);
    this.requiredHeaders.set(null);
    inputEl.value = '';
  }

  // Utilitaire: SHA-256 hex (pour FIT)
  private async sha256Hex(file: File): Promise<string> {
    const buf = await file.arrayBuffer();
    const hash = await crypto.subtle.digest('SHA-256', buf);
    const arr = Array.from(new Uint8Array(hash));
    return arr.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  }
}