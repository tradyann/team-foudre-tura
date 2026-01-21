import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    Router
} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class LangGuard implements CanActivate {
    private supportedLangs = ['en', 'fr'];

    constructor(private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const lang = route.params['lang'];
        if (this.supportedLangs.includes(lang)) {
        return true;
        }
        this.router.navigate(['/not-found']);
        return false;
    }
}
