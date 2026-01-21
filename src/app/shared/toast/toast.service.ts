// toast.service.ts
import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'info' | 'error' | 'warning';
export interface ToastMessage {
    id: number;
    message: string;
    type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    private counter = 0;
    private _messages = signal<ToastMessage[]>([]);
    public readonly messages = this._messages.asReadonly();

    show(message: string, type: ToastType = 'info', timeout = 3000) {
        const id = ++this.counter;
        const newToast = { id, message, type };
        this._messages.update(msgs => [...msgs, newToast]);

        if (timeout > 0) {
        setTimeout(() => this.dismiss(id), timeout);
        }
    }

    dismiss(id: number) {
        this._messages.update(msgs => msgs.filter(msg => msg.id !== id));
    }
}
