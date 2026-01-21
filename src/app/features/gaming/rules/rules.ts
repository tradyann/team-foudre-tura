import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-rules',
  imports: [RouterLink],
  templateUrl: './rules.html',
  styleUrl: './rules.css'
})
export class Rules {
  private route = inject(ActivatedRoute);
  ngOnInit() {
    this.route.fragment.subscribe(f => {
      if (f) {
        const el = document.getElementById(f);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }
}