import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class LangService {
    private lang: string = 'en';

    constructor(private route: ActivatedRoute) {
        this.route.params.subscribe(params => {
            if (params['lang']) {
            this.lang = params['lang'];
            }
        });
    }

    getLang(): string {
        return this.lang;
    }
}
