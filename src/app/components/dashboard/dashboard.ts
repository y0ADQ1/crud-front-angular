import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonService, StatsResponse } from '../../services/person';
import { AuthService } from '../../services/auth';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit {
  stats: StatsResponse | null = null;
  statKeys: string[] = [];
  currentFilter: 'default' | 'age' | 'combined' = 'default';

  constructor(public authService: AuthService, private personService: PersonService) {}

  ngOnInit() {
    this.loadStats('default');
  }

  loadStats(filter: 'default' | 'age' | 'combined') {
    this.currentFilter = filter;
    this.personService.getStats(filter).subscribe({
      next: (data) => {
        this.stats = data;
        this.statKeys = Object.keys(data);
      },
      error: (err) => {
        console.error('Error loading stats:', err);
      },
    });
  }

  getBarHeight(value: number): string {
    const maxValue = Math.max(...Object.values(this.stats || { default: 100 }));
    return `${(value / maxValue) * 100}%`;
  }
}
