import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, TerminalIcon, ShirtIcon, UploadIcon, BookOpenIcon, RouteIcon } from 'lucide-angular';

@Component({
  selector: 'app-menu-manager',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './menu-manager.html',
  styleUrl: './menu-manager.css'
})
export class MenuManager {
  TerminalIcon = TerminalIcon;
  ShirtIcon = ShirtIcon;
  UploadIcon = UploadIcon;
  BookOpenIcon = BookOpenIcon;
  RouteIcon = RouteIcon;
}
