import { Component } from '@angular/core';

@Component({
  selector: 'app-blocked',
  imports: [],
  templateUrl: './blocked.html',
  styleUrl: './blocked.css'
})
export class Blocked {
  private user = 'support';
  private domain = 'turaracing.com';

  email?: string;

  revealEmail() {
    this.email = `${this.user}@${this.domain}`;
  }
}
