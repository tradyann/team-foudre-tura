import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from './shared/toast/toast';
import { ThemeService } from './services/theme.service';
import { ZwiftLinkState } from './services/zwift-link.state';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Foudre - Tour';
  theme = inject(ThemeService);

  private zwiftLinkState = inject(ZwiftLinkState);

  constructor() {
    this.zwiftLinkState.initFromStorage();
  }
}
