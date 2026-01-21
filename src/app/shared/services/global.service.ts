import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GlobalService {
    private _roleId = signal<number | null>(null);
    roleId = this._roleId.asReadonly();

    setRoleId(roleId: number) {
        this._roleId.set(roleId);
    }

    getRoleId(): number | null {
        return this._roleId();
    }
}
