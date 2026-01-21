import { inject, Injectable, signal } from '@angular/core';
import { UserService } from '../../features/user/user.service';

@Injectable({ providedIn: 'root' })
export class TimeZoneService {
    private readonly storageKey = 'user.timezone';
    public timeZone = signal<string>(this.load());
    userService = inject(UserService);

    private load(): string {
        return (
        localStorage.getItem(this.storageKey) ||
        Intl.DateTimeFormat().resolvedOptions().timeZone ||
        'UTC'
        );
    }

    set(zone: string) {
        this.timeZone.set(zone);
        localStorage.setItem(this.storageKey, zone);
        // store in DB
        this.userService.changeTimeZone(zone).subscribe({
            next: (res: any) => {
                console.log(res);
            },
            error: (err: any) => {
                console.warn(err);
            }}
        )
    }

    get(): string {
        return this.timeZone();
    }
}
