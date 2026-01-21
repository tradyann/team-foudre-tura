import { Component, inject, signal } from '@angular/core';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  userService = inject(UserService);

  // DATA
  results = signal<{ 
    zwiftId: number; 
    racerName: string;
    imageSrc: string;
    flag: string;
    male: boolean;
    scoring: number;
    wk60: number;
    wk300: number;
    wk1200: number;
    w60: number;
    w300: number;
    w1200: number;
    tCat: string;
    teamId: number; 
    teamName: string;
    balance: number; 
  } | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.userService.getClientDetails().subscribe({
        next: (data) => {
          this.results.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          if(err.status === 401) { alert('Unauthorized. Try to login again.') };
          this.error.set('Error loading results');
          console.error(err);
          this.loading.set(false);
        }
      });
  }
}
