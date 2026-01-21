import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'duration' })
export class DurationPipe implements PipeTransform {
    transform(value: number | null | undefined, showMs = false): string {
        const n = Number(value);
        if (!Number.isFinite(n)) return showMs ? '--:--.---' : '--:--';

        const sign = n < 0 ? '-' : '';
        const abs = Math.abs(n);

        // valeur en SECONDES (peut contenir des décimales)
        const totalSecs = Math.floor(abs);
        const ms = Math.floor((abs - totalSecs) * 1000); // extraire partie décimale

        const hrs = Math.floor(totalSecs / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;

        const pad2 = (x: number) => x.toString().padStart(2, '0');
        const pad3 = (x: number) => x.toString().padStart(3, '0');

        if (showMs) {
        return hrs > 0
            ? `${sign}${hrs}:${pad2(mins)}:${pad2(secs)}.${pad3(ms)}`
            : `${sign}${pad2(mins)}:${pad2(secs)}.${pad3(ms)}`;
        }

        return hrs > 0
        ? `${sign}${hrs}:${pad2(mins)}:${pad2(secs)}`
        : `${sign}${pad2(mins)}:${pad2(secs)}`;
    }
}
