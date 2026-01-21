import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-jersey',
  imports: [CommonModule],
  templateUrl: './jersey.html',
  styleUrl: './jersey.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Jersey {
  // --- API ---
  @Input() variant: string = 'full';

  /** Taille en px du côté (le SVG est carré, viewBox 24x24) */
  @Input() size = 24;

  /** Couleur de remplissage (full) ou fond (polka/uci) */
  @Input() fill = '#ffffff';

  /** Couleur du contour */
  @Input() stroke = '#000000';

  /** Épaisseur du contour */
  @Input() strokeWidth = 1.3;

  /** Couleur des pois (pour variant='polka') */
  @Input() dotsColor = '#dc2626'; // red-600

  /** Taille cellule du pattern des pois (px) */
  @Input() dotsGap = 4;

  /** Rayon des pois (px) */
  @Input() dotsR = 2;

  // --- IDs uniques pour <pattern> / <clipPath> par instance (évite collisions DOM) ---
  private uid = Math.random().toString(36).slice(2);
  get patId()  { return `pat-${this.uid}`; }
  get clipId() { return `clip-${this.uid}`; }

  /** Path commun du maillot */
  readonly jerseyPathD =
    'M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z';
}