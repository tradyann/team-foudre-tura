import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-essential-rules',
  imports: [CommonModule, RouterLink],
  templateUrl: './essential-rules.html',
  styleUrl: './essential-rules.css'
})
export class EssentialRules {
  isOpen = false;
}
