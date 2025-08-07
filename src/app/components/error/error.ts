import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error.html',
  styleUrls: ['./error.scss'],
})
export class ErrorComponent {
  @Input() errors: string[] = [];
}
