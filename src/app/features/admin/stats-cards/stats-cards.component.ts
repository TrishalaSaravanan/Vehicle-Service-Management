import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div *ngFor="let stat of stats" 
           class="stat-card bg-white p-6 rounded-xl shadow-md border-l-4 transition duration-300"
           [ngClass]="{
             'border-primary': stat.color === 'primary',
             'border-secondary': stat.color === 'secondary',
             'border-accent': stat.color === 'accent',
             'border-green-500': stat.color === 'green'
           }">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-500">{{stat.title}}</p>
            <p class="text-3xl font-bold mt-2"
               [ngClass]="{
                 'text-primary': stat.color === 'primary',
                 'text-secondary': stat.color === 'secondary',
                 'text-accent': stat.color === 'accent',
                 'text-green-500': stat.color === 'green'
               }">{{stat.value}}</p>
          </div>
          <div class="p-3 rounded-lg"
               [ngClass]="{
                 'bg-primary bg-opacity-10': stat.color === 'primary',
                 'bg-secondary bg-opacity-10': stat.color === 'secondary',
                 'bg-accent bg-opacity-10': stat.color === 'accent',
                 'bg-green-500 bg-opacity-10': stat.color === 'green'
               }">
            <i [class]="stat.icon"
               [ngClass]="{
                 'text-primary': stat.color === 'primary',
                 'text-secondary': stat.color === 'secondary',
                 'text-accent': stat.color === 'accent',
                 'text-green-500': stat.color === 'green'
               }"></i>
          </div>
        </div>
        <p class="text-sm mt-2"
           [ngClass]="{
             'text-green-600': stat.trend === 'up',
             'text-red-600': stat.trend === 'down'
           }">
          <i [class]="stat.trend === 'up' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i> 
          {{stat.change}} from {{stat.period}}
        </p>
      </div>
    </div>
  `,
  styles: [`
    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    :host {
      --primary: #1B4B88;
      --secondary: #2D9CDB;
      --accent: #F2C94C;
    }
  `]
})
export class StatsCardsComponent {
  stats = [
    {
      title: 'Total Users',
      value: '1,250',
      icon: 'fas fa-users',
      color: 'primary',
      trend: 'up',
      change: '12%',
      period: 'last month'
    },
    {
      title: 'Total Mechanics',
      value: '45',
      icon: 'fas fa-tools',
      color: 'secondary',
      trend: 'up',
      change: '5%',
      period: 'last month'
    },
    {
      title: 'New Bookings',
      value: '30',
      icon: 'fas fa-calendar-check',
      color: 'accent',
      trend: 'down',
      change: '2%',
      period: 'yesterday'
    },
    {
      title: 'Today Schedules',
      value: '12',
      icon: 'fas fa-clock',
      color: 'green',
      trend: 'up',
      change: '20%',
      period: 'yesterday'
    }
  ];
}