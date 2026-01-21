import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthDevGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate(): boolean {
        const key = localStorage.getItem('devKey');
        if (key === 'thisIsMySecretKeyForDev') {
        return true;
        }
        // alert('🚧 Platform under development. Access denied.');
        this.router.navigateByUrl('/blocked'); // ou page statique
        return false;
    }
}
