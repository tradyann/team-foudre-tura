import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ZwiftLinkState {
  private readonly _zwiftId = signal<number | null>(null);

  zwiftId = this._zwiftId.asReadonly();

  initFromStorage() {
    const v = localStorage.getItem('zwiftIdLinked');
    if (v) this._zwiftId.set(+v);
  }

  setZwiftId(id: number) {
    localStorage.setItem('zwiftIdLinked', id.toString());
    this._zwiftId.set(id);
  }

  clear() {
    localStorage.removeItem('zwiftIdLinked');
    this._zwiftId.set(null);
  }

  isLinked(): boolean {
    return this._zwiftId() !== null;
  }
}
