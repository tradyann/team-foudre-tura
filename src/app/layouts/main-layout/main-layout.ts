import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { Header } from '../header/header';
import '@weblogin/trendchart-elements';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Footer } from '../footer/footer';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // 👈 obligatoire pour <tc-line> etc.
})
export class MainLayout {
  showBackToTop = false;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.isBrowser) return;
    this.showBackToTop = window.pageYOffset > 300;
  }

  scrollToTop(): void {
    if (!this.isBrowser) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeDrawer() {
    const drawer = document.getElementById('my-drawer') as HTMLInputElement;
    if (drawer) drawer.checked = false;
  }

}
