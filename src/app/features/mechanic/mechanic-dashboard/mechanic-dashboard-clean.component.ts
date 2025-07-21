import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface Job {
  id: string;
  title: string;
  vehicle: string;
  customer: string;
  status: string;
  dueDate: string;
  assignedTime?: string;
  adminNotes?: string;
  rating?: string;
}

interface Appointment {
  time: string;
  service: string;
  customer: string;
  vehicle: string;
}

interface Notification {
  title: string;
  description: string;
  icon: string;
  iconBg: string;
}

@Component({
  selector: 'app-mechanic-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mechanic-dashboard-clean.component.html',
  styleUrl: './mechanic-dashboard-clean.component.css'
})
export class MechanicDashboardComponent implements OnInit {
  // Stats (matching the provided design)
  pendingJobs = 3;
  inProgress = 5;
  completedToday = 12;
  avgRating = 4.8;
  totalJobs = 8;

  // Notifications
  showNotifications = false;
  notificationCount = 3;
  notifications: Notification[] = [
    {
      title: 'New Work Order',
      description: 'Brake repair for Toyota Camry assigned',
      icon: 'fas fa-wrench text-blue-600',
      iconBg: 'bg-blue-100'
    },
    {
      title: 'Part Request Approved',
      description: 'Brake pads order approved',
      icon: 'fas fa-check text-green-600',
      iconBg: 'bg-green-100'
    },
    {
      title: 'Schedule Update',
      description: 'Tomorrow schedule updated',
      icon: 'fas fa-calendar text-orange-600',
      iconBg: 'bg-orange-100'
    }
  ];

  // Filters
  statusFilter = '';

  // Modal states
  showAcceptModal = false;
  showUpdateForm = false;
  showCustomerModal = false;
  showLogoutModal = false;
  selectedJobId: string | null = null;
  selectedJob: Job | null = null;

  // Sample data with more detailed information
  recentJobs: Job[] = [
    {
      id: 'job1',
      title: 'Brake System Repair',
      vehicle: 'Toyota Camry (2020) - JT2BF22K3W0123456',
      customer: 'kumar',
      status: 'pending',
      dueDate: 'Tomorrow, 5:00 PM',
      assignedTime: 'Today, 10:30 AM',
      adminNotes: 'Customer reports squeaking noise when braking'
    },
    {
      id: 'job2',
      title: 'Oil Change & Filter Replacement',
      vehicle: 'Honda Civic (2019) - 2HGFC2F56KH123456',
      customer: 'Sarah',
      status: 'in-progress',
      dueDate: 'Today, 3:00 PM',
      assignedTime: 'Today, 11:15 AM',
      adminNotes: 'Full synthetic oil requested'
    },
    {
      id: 'job3',
      title: 'Tire Rotation & Alignment',
      vehicle: 'Ford F-150 (2021) - 1FTFW1E5XMK123456',
      customer: 'Naveen',
      status: 'completed',
      dueDate: 'Yesterday, 4:30 PM',
      assignedTime: 'Yesterday, 9:00 AM',
      adminNotes: 'Customer requested premium alignment',
      rating: '5/5'
    }
  ];

  todaySchedule: Appointment[] = [
    {
      time: '9:00 AM',
      service: 'Brake Inspection',
      customer: 'Sarah',
      vehicle: 'BMW X3 (2022)'
    },
    {
      time: '11:00 AM',
      service: 'Oil Change',
      customer: 'Dhyan',
      vehicle: 'Audi A4 (2020)'
    },
    {
      time: '2:00 PM',
      service: 'Tire Rotation',
      customer: 'Ganesh',
      vehicle: 'Mercedes C-Class (2021)'
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Initialize component
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  filterJobs(): void {
    // Filter jobs based on statusFilter
    console.log('Filtering jobs by status:', this.statusFilter);
  }

  // Job management methods
  showAcceptPopup(jobId: string): void {
    this.selectedJobId = jobId;
    this.showAcceptModal = true;
  }

  hideAcceptPopup(): void {
    this.showAcceptModal = false;
    this.selectedJobId = null;
  }

  acceptJob(): void {
    if (this.selectedJobId) {
      const job = this.recentJobs.find(j => j.id === this.selectedJobId);
      if (job) {
        job.status = 'in-progress';
      }
    }
    this.hideAcceptPopup();
    this.showNotification('Job accepted successfully!', 'success');
  }

  showUpdateJobForm(job: Job): void {
    this.selectedJob = job;
    this.selectedJobId = job.id;
    this.showUpdateForm = true;
  }

  hideUpdateForm(): void {
    this.showUpdateForm = false;
    this.selectedJob = null;
    this.selectedJobId = null;
  }

  saveUpdate(): void {
    this.hideUpdateForm();
    this.showNotification('Job updated successfully!', 'success');
  }

  // Customer details methods
  showCustomerDetailsModal(job: Job): void {
    this.selectedJob = job;
    this.showCustomerModal = true;
  }

  hideCustomerDetails(): void {
    this.showCustomerModal = false;
    this.selectedJob = null;
  }

  // Logout methods
  confirmLogout(): void {
    this.showLogoutModal = true;
  }

  hideLogoutPopup(): void {
    this.showLogoutModal = false;
  }

  performLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Job details for completed jobs
  showJobDetails(job: Job): void {
    console.log('Viewing job details:', job);
    // In a real app, navigate to job details page or show modal
  }

  // Utility methods
  showNotification(message: string, type: string): void {
    // In a real app, implement proper notification system
    console.log(`${type}: ${message}`);
  }

  // Helper methods for template
  getCustomerName(customerString: string): string {
    return customerString.split('(')[0].trim();
  }

  getCustomerPhone(customerString: string): string {
    const match = customerString.match(/\((.*?)\)/);
    return match ? match[1] : 'N/A';
  }

  getCustomerEmail(customerString: string): string {
    const name = this.getCustomerName(customerString);
    return name.toLowerCase().replace(' ', '.') + '@example.com';
  }

  getVehicleName(vehicleString: string): string {
    return vehicleString.split(' - ')[0];
  }

  getVehicleVin(vehicleString: string): string {
    const parts = vehicleString.split(' - ');
    return parts.length > 1 ? parts[1] : 'N/A';
  }
}
