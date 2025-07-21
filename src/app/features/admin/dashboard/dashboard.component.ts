import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { StatsCardsComponent } from '../stats-cards/stats-cards.component';
import { RecentBookingsComponent } from '../recent-bookings/recent-bookings.component';
import { TodaySchedulesComponent } from '../today-schedules/today-schedules.component';
import { RecentActivityComponent } from '../recent-activity/recent-activity.component';

interface Booking {
  id: string;
  customer: {
    name: string;
    phone: string;
    avatar: string;
  };
  service: string;
  date: string;
  time: string;
  status: 'new' | 'assigned' | 'completed';
  mechanic?: string;
}

interface Schedule {
  time: string;
  customer: string;
  vehicle: string;
  service: string;
  mechanic: {
    name: string;
    avatar: string;
  };
  status: 'scheduled' | 'completed' | 'in-progress';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HeaderComponent
  ],
  template: `
    <!-- Header -->
    <app-header></app-header>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="stat-card bg-white p-6 rounded-xl shadow-md border-t-4 border-primary">
        <div class="flex justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Users</p>
            <p class="text-3xl font-bold text-primary mt-2">1,284</p>
          </div>
          <div class="bg-primary bg-opacity-10 p-3 rounded-lg h-12 w-12 flex items-center justify-center">
            <i class="fas fa-users text-primary text-lg"></i>
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <span class="text-sm text-green-600">
            <i class="fas fa-arrow-up mr-1"></i> 12.5%
          </span>
          <span class="text-sm text-gray-500 ml-2">vs last month</span>
        </div>
      </div>
      
      <div class="stat-card bg-white p-6 rounded-xl shadow-md border-t-4 border-secondary">
        <div class="flex justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Bookings</p>
            <p class="text-3xl font-bold text-secondary mt-2">42</p>
          </div>
          <div class="bg-secondary bg-opacity-10 p-3 rounded-lg h-12 w-12 flex items-center justify-center">
            <i class="fas fa-calendar-check text-secondary text-lg"></i>
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <span class="text-sm text-red-600">
            <i class="fas fa-arrow-down mr-1"></i> 3.2%
          </span>
          <span class="text-sm text-gray-500 ml-2">vs yesterday</span>
        </div>
      </div>
      
      <div class="stat-card bg-white p-6 rounded-xl shadow-md border-t-4 border-accent">
        <div class="flex justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Today's Revenue</p>
            <p class="text-3xl font-bold text-accent mt-2">₹28,750</p>
          </div>
          <div class="bg-accent bg-opacity-10 p-3 rounded-lg h-12 w-12 flex items-center justify-center">
            <i class="fas fa-rupee-sign text-accent text-lg"></i>
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <span class="text-sm text-green-600">
            <i class="fas fa-arrow-up mr-1"></i> 24.8%
          </span>
          <span class="text-sm text-gray-500 ml-2">vs yesterday</span>
        </div>
      </div>
      
      <div class="stat-card bg-white p-6 rounded-xl shadow-md border-t-4 border-purple-500">
        <div class="flex justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Available Mechanics</p>
            <p class="text-3xl font-bold text-purple-500 mt-2">8/12</p>
          </div>
          <div class="bg-purple-100 p-3 rounded-lg h-12 w-12 flex items-center justify-center">
            <i class="fas fa-tools text-purple-500 text-lg"></i>
          </div>
        </div>
        <div class="mt-4">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-purple-500 h-2 rounded-full" style="width: 66%"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Bookings Section -->
    <div class="bg-white p-6 rounded-xl shadow-md mb-8">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold text-dark">Recent Bookings</h3>
        <div class="relative">
          <select 
            [(ngModel)]="statusFilter" 
            (change)="onStatusFilterChange()"
            class="appearance-none bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="assigned">Assigned</option>
            <option value="completed">Completed</option>
          </select>
          <i class="fas fa-chevron-down absolute right-3 top-3 text-gray-500 text-xs"></i>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b">
              <th class="py-3 px-4 text-left text-gray-600">Booking ID</th>
              <th class="py-3 px-4 text-left text-gray-600">Customer</th>
              <th class="py-3 px-4 text-left text-gray-600">Service</th>
              <th class="py-3 px-4 text-left text-gray-600">Date/Time</th>
              <th class="py-3 px-4 text-left text-gray-600">Status</th>
              <th class="py-3 px-4 text-left text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr *ngFor="let booking of filteredBookings" class="hover:bg-gray-50">
              <td class="py-3 px-4 font-medium">{{ booking.id }}</td>
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <img [src]="booking.customer.avatar" alt="Customer" class="h-8 w-8 rounded-full mr-2">
                  <div>
                    <p>{{ booking.customer.name }}</p>
                    <p class="text-xs text-gray-500">{{ booking.customer.phone }}</p>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">{{ booking.service }}</td>
              <td class="py-3 px-4">
                <p>{{ booking.time }}</p>
                <p class="text-xs text-gray-500">{{ booking.date }}</p>
              </td>
              <td class="py-3 px-4">
                <span class="px-3 py-1 rounded-full text-xs" [class]="getStatusClass(booking.status)">
                  {{ getStatusText(booking.status, booking.mechanic) }}
                </span>
              </td>
              <td class="py-3 px-4">
                <button 
                  *ngIf="booking.status === 'new'"
                  (click)="openAssignModal(booking.id)"
                  class="px-3 py-1 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition">
                  Assign
                </button>
                <button 
                  *ngIf="booking.status === 'assigned'"
                  class="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm cursor-not-allowed"
                  disabled>
                  Assigned
                </button>
                <span *ngIf="booking.status === 'completed'" class="text-gray-400 text-sm">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- View All Bookings Button -->
      <div class="text-center mt-4">
        <button 
          (click)="toggleViewAllBookings()"
          class="text-primary hover:text-primary-dark font-medium text-sm">
          {{ showAllBookings ? 'Show Recent Only' : 'View All Bookings' }}
          <i class="fas fa-chevron-right ml-1"></i>
        </button>
      </div>
    </div>

    <!-- Today's Schedules Section -->
    <div class="bg-white p-6 rounded-xl shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold text-dark">Today's Schedules</h3>
        <div class="flex items-center space-x-2">
          
        </div>
      </div>
      
      <!-- Schedules Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b">
              <th class="py-3 px-4 text-left text-gray-600">Time</th>
              <th class="py-3 px-4 text-left text-gray-600">Customer</th>
              <th class="py-3 px-4 text-left text-gray-600">Vehicle</th>
              <th class="py-3 px-4 text-left text-gray-600">Service</th>
              <th class="py-3 px-4 text-left text-gray-600">Mechanic</th>
              <th class="py-3 px-4 text-left text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr *ngFor="let schedule of todaySchedules" class="hover:bg-gray-50">
              <td class="py-3 px-4">{{ schedule.time }}</td>
              <td class="py-3 px-4 font-medium">{{ schedule.customer }}</td>
              <td class="py-3 px-4">{{ schedule.vehicle }}</td>
              <td class="py-3 px-4">{{ schedule.service }}</td>
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <img [src]="schedule.mechanic.avatar" alt="Mechanic" class="h-6 w-6 rounded-full mr-2">
                  {{ schedule.mechanic.name }}
                </div>
              </td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 rounded-full text-xs" [class]="getStatusClass(schedule.status)">
                  {{ getStatusText(schedule.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty state message -->
      <div *ngIf="todaySchedules.length === 0" class="text-center py-8 text-gray-500">
        <i class="fas fa-calendar-times text-2xl mb-2"></i>
        <p>No schedules found for this date</p>
      </div>
    </div>

    <!-- Assign Mechanic Modal -->
    <div *ngIf="showAssignModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-96">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold">Assign Mechanic</h3>
          <button (click)="closeAssignModal()" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="mb-4">
          <p class="mb-2">Select Mechanic:</p>
          <select 
            [(ngModel)]="selectedMechanic"
            class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
            <option value="">Choose a mechanic...</option>
            <option *ngFor="let mechanic of availableMechanics" [value]="mechanic">
              {{ mechanic }}
            </option>
          </select>
        </div>
        <button 
          (click)="confirmAssign()"
          [disabled]="!selectedMechanic"
          class="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed">
          Assign Mechanic
        </button>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
    }

    /* Custom color classes */
    :host ::ng-deep {
      .text-primary { color: #1B4B88; }
      .bg-primary { background-color: #1B4B88; }
      .border-primary { border-color: #1B4B88; }
      .text-secondary { color: #2D9CDB; }
      .bg-secondary { background-color: #2D9CDB; }
      .border-secondary { border-color: #2D9CDB; }
      .text-accent { color: #F2C94C; }
      .bg-accent { background-color: #F2C94C; }
      .border-accent { border-color: #F2C94C; }
      .text-dark { color: #1A1A1A; }
      .hover\\:bg-primary-dark:hover { background-color: #0f2d4f; }
      .hover\\:text-primary-dark:hover { color: #0f2d4f; }
    }

    /* Table and responsive styling */
    table { border-collapse: separate; border-spacing: 0; }
    
    @media (max-width: 768px) {
      .stat-card { margin-bottom: 1rem; }
      .overflow-x-auto { -webkit-overflow-scrolling: touch; }
      table { min-width: 600px; }
    }

    button { transition: all 0.2s ease; }
    button:hover:not(:disabled) { transform: translateY(-1px); }
    button:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class DashboardComponent implements OnInit {
  statusFilter: string = 'all';
  selectedDate: string = '';
  showAllBookings: boolean = false;
  showAssignModal: boolean = false;
  selectedBookingId: string = '';
  availableMechanics: string[] = ['Kumar', 'Vikram', 'Anil'];
  selectedMechanic: string = '';

  bookings: Booking[] = [
    {
      id: '#BK105',
      customer: {
        name: 'Amirtha',
        phone: '9876543210',
        avatar: 'https://ui-avatars.com/api/?name=A'
      },
      service: 'Full Service',
      date: '12 Jul 2023',
      time: 'Today, 10:00 AM',
      status: 'new'
    },
    {
      id: '#BK104',
      customer: {
        name: 'Kiran',
        phone: '8765432109',
        avatar: 'https://ui-avatars.com/api/?name=K'
      },
      service: 'AC Repair',
      date: '12 Jul 2023',
      time: 'Today, 2:30 PM',
      status: 'assigned',
      mechanic: 'Kumar'
    },
    {
      id: '#BK103',
      customer: {
        name: 'Rahul',
        phone: '7654321098',
        avatar: 'https://ui-avatars.com/api/?name=R'
      },
      service: 'Oil Change',
      date: '11 Jul 2023',
      time: 'Yesterday, 11:00 AM',
      status: 'completed'
    }
  ];

  todaySchedules: Schedule[] = [
    {
      time: '10:00 AM',
      customer: 'Amirtha',
      vehicle: 'Honda City',
      service: 'Full Service',
      mechanic: {
        name: 'Kumar',
        avatar: 'https://ui-avatars.com/api/?name=K'
      },
      status: 'scheduled'
    },
    {
      time: '2:30 PM',
      customer: 'Kiran',
      vehicle: 'Hyundai i20',
      service: 'AC Repair',
      mechanic: {
        name: 'Vikram',
        avatar: 'https://ui-avatars.com/api/?name=V'
      },
      status: 'completed'
    }
  ];

  get filteredBookings(): Booking[] {
    if (this.statusFilter === 'all') {
      return this.showAllBookings ? this.bookings : this.bookings.filter((_, index) => index < 2);
    }
    return this.bookings.filter(booking => booking.status === this.statusFilter);
  }

  ngOnInit(): void {
    // Set today's date
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
  }

  onStatusFilterChange(): void {
    // Filter functionality is handled by the getter
  }

  toggleViewAllBookings(): void {
    this.showAllBookings = !this.showAllBookings;
  }

  openAssignModal(bookingId: string): void {
    this.selectedBookingId = bookingId;
    this.showAssignModal = true;
  }

  closeAssignModal(): void {
    this.showAssignModal = false;
    this.selectedBookingId = '';
    this.selectedMechanic = '';
  }

  confirmAssign(): void {
    if (this.selectedMechanic) {
      // Find and update the booking
      const booking = this.bookings.find(b => b.id === this.selectedBookingId);
      if (booking) {
        booking.status = 'assigned';
        booking.mechanic = this.selectedMechanic;
      }
      
      // Show success message
      alert('Mechanic assigned successfully!');
      this.closeAssignModal();
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string, mechanic?: string): string {
    if (status === 'assigned' && mechanic) {
      return `Assigned to ${mechanic}`;
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  refreshSchedules(): void {
    // In a real app, this would fetch new data from the server
    console.log('Refreshing schedules for date:', this.selectedDate);
  }
}