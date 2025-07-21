import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Mechanic {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  currentWorkload: number;
  maxWorkload: number;
  status: 'Available' | 'Busy';
  rating: number;
}

interface ServiceRequest {
  id: string;
  customer: string;
  vehicle: string;
  issue: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Assigned' | 'Completed';
  date: string;
  assignedMechanic?: string;
  assignedMechanicId?: string;
  assignedDate?: string;
  completedDate?: string;
}

@Component({
  selector: 'app-mechanic-assign',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mechanic-assign.component.html',
  styleUrls: ['./mechanic-assign.component.css']
})
export class MechanicAssignComponent implements OnInit {
  mechanics: Mechanic[] = [
    { id: 'M001', name: 'Bennet', specialization: 'Engine', experience: '8 years', currentWorkload: 2, maxWorkload: 4, status: 'Available', rating: 4.7 },
    { id: 'M002', name: 'Ram', specialization: 'Electrical', experience: '5 years', currentWorkload: 3, maxWorkload: 4, status: 'Busy', rating: 4.3 },
    { id: 'M003', name: 'Harshan', specialization: 'Transmission', experience: '6 years', currentWorkload: 1, maxWorkload: 5, status: 'Available', rating: 4.5 },
    { id: 'M004', name: 'Priya', specialization: 'Brakes & Suspension', experience: '4 years', currentWorkload: 0, maxWorkload: 3, status: 'Available', rating: 4.2 },
    { id: 'M005', name: 'Arjun', specialization: 'Diagnostics', experience: '10 years', currentWorkload: 2, maxWorkload: 5, status: 'Available', rating: 4.9 },
    { id: 'M006', name: 'Sophia', specialization: 'AC & Heating', experience: '3 years', currentWorkload: 4, maxWorkload: 4, status: 'Busy', rating: 4.0 },
    { id: 'M007', name: 'Karthik', specialization: 'General Maintenance', experience: '7 years', currentWorkload: 2, maxWorkload: 6, status: 'Available', rating: 4.6 }
  ];

  serviceRequests: ServiceRequest[] = [
    { id: 'SR001', customer: 'Harish', vehicle: 'Toyota Camry 2018', issue: 'Engine overheating', priority: 'High', status: 'Pending', date: '2023-06-15' },
    { id: 'SR002', customer: 'Sarah', vehicle: 'Honda Civic 2020', issue: 'Brake system check', priority: 'Medium', status: 'Pending', date: '2023-06-16' },
    { id: 'SR003', customer: 'Jungkook', vehicle: 'Ford F-150 2019', issue: 'Electrical issues', priority: 'Low', status: 'Pending', date: '2023-06-16' },
    { id: 'SR004', customer: 'Michael', vehicle: 'BMW X5 2021', issue: 'Transmission fluid leak', priority: 'High', status: 'Pending', date: '2023-06-17' },
    { id: 'SR005', customer: 'Emma', vehicle: 'Hyundai Tucson 2019', issue: 'AC not cooling', priority: 'Medium', status: 'Pending', date: '2023-06-17' },
    { id: 'SR006', customer: 'Raj', vehicle: 'Maruti Swift 2020', issue: 'Oil change and general checkup', priority: 'Low', status: 'Pending', date: '2023-06-18' }
  ];

  showMechanicForm = false;
  showRequestForm = false;
  selectedMechanicId: { [key: string]: string } = {};

  // Form data
  newMechanic = {
    name: '',
    specialization: '',
    experience: '',
    maxWorkload: 4,
    rating: 4.0
  };

  newRequest = {
    customer: '',
    vehicle: '',
    issue: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low'
  };

  ngOnInit(): void {
    this.updateMechanicStatus();
  }

  updateMechanicStatus(): void {
    this.mechanics.forEach(mechanic => {
      mechanic.status = mechanic.currentWorkload >= mechanic.maxWorkload ? 'Busy' : 'Available';
    });
  }

  getWorkloadPercentage(mechanic: Mechanic): number {
    return (mechanic.currentWorkload / mechanic.maxWorkload) * 100;
  }

  getWorkloadColor(percentage: number): string {
    if (percentage > 80) return 'bg-red-500';
    if (percentage > 60) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'High': return 'bg-red-500 text-white';
      case 'Medium': return 'bg-yellow-500 text-white';
      case 'Low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Available': return 'bg-green-500 text-white';
      case 'Busy': return 'bg-yellow-500 text-white';
      case 'Pending': return 'bg-blue-100 text-blue-800';
      case 'Assigned': return 'bg-purple-100 text-purple-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getAvailableMechanics(): Mechanic[] {
    return this.mechanics.filter(m => m.status === 'Available' && m.currentWorkload < m.maxWorkload);
  }

  getSortedRequests(): ServiceRequest[] {
    return [...this.serviceRequests].sort((a, b) => {
      const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority] || 
             new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }

  assignWork(requestId: string, mechanicId: string): void {
    if (!mechanicId) {
      alert('Please select a mechanic first.');
      return;
    }

    const request = this.serviceRequests.find(r => r.id === requestId);
    const mechanic = this.mechanics.find(m => m.id === mechanicId);

    if (request && mechanic) {
      if (mechanic.currentWorkload >= mechanic.maxWorkload) {
        alert(`Cannot assign to ${mechanic.name}. Maximum workload reached!`);
        return;
      }

      request.status = 'Assigned';
      request.assignedMechanic = mechanic.name;
      request.assignedMechanicId = mechanic.id;
      request.assignedDate = new Date().toISOString().split('T')[0];

      mechanic.currentWorkload += 1;
      this.updateMechanicStatus();

      // Clear selection
      this.selectedMechanicId[requestId] = '';

      alert(`Assigned ${request.customer}'s ${request.vehicle} (${request.issue}) to ${mechanic.name} (${mechanic.specialization})`);
    }
  }

  completeWork(requestId: string): void {
    const request = this.serviceRequests.find(r => r.id === requestId);
    const mechanic = this.mechanics.find(m => m.id === request?.assignedMechanicId);

    if (request && mechanic) {
      request.status = 'Completed';
      request.completedDate = new Date().toISOString().split('T')[0];

      mechanic.currentWorkload -= 1;
      this.updateMechanicStatus();

      alert(`Marked ${request.customer}'s ${request.vehicle} as completed by ${mechanic.name}`);
    }
  }

  toggleMechanicForm(): void {
    this.showMechanicForm = !this.showMechanicForm;
    this.showRequestForm = false;
  }

  toggleRequestForm(): void {
    this.showRequestForm = !this.showRequestForm;
    this.showMechanicForm = false;
  }

  addNewMechanic(): void {
    if (this.newMechanic.name && this.newMechanic.specialization) {
      const mechanic: Mechanic = {
        id: 'M' + (this.mechanics.length + 1).toString().padStart(3, '0'),
        name: this.newMechanic.name,
        specialization: this.newMechanic.specialization,
        experience: this.newMechanic.experience,
        currentWorkload: 0,
        maxWorkload: this.newMechanic.maxWorkload,
        status: 'Available',
        rating: this.newMechanic.rating
      };

      this.mechanics.push(mechanic);
      this.resetMechanicForm();
      this.showMechanicForm = false;
      alert(`${mechanic.name} added to the team!`);
    }
  }

  addNewServiceRequest(): void {
    if (this.newRequest.customer && this.newRequest.vehicle && this.newRequest.issue) {
      const request: ServiceRequest = {
        id: 'SR' + (this.serviceRequests.length + 1).toString().padStart(3, '0'),
        customer: this.newRequest.customer,
        vehicle: this.newRequest.vehicle,
        issue: this.newRequest.issue,
        priority: this.newRequest.priority,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0]
      };

      this.serviceRequests.push(request);
      this.resetRequestForm();
      this.showRequestForm = false;
      alert(`New service request #${request.id} created!`);
    }
  }

  resetMechanicForm(): void {
    this.newMechanic = {
      name: '',
      specialization: '',
      experience: '',
      maxWorkload: 4,
      rating: 4.0
    };
  }

  resetRequestForm(): void {
    this.newRequest = {
      customer: '',
      vehicle: '',
      issue: '',
      priority: 'Medium'
    };
  }

  getStatsCards() {
    const totalMechanics = this.mechanics.length;
    const availableMechanics = this.mechanics.filter(m => m.status === 'Available').length;
    const totalRequests = this.serviceRequests.length;
    const pendingRequests = this.serviceRequests.filter(r => r.status === 'Pending').length;
    const inProgressRequests = this.serviceRequests.filter(r => r.status === 'Assigned').length;
    const activeJobs = this.mechanics.reduce((sum, m) => sum + m.currentWorkload, 0);
    const today = new Date().toISOString().split('T')[0];
    const completedToday = this.serviceRequests.filter(r => r.status === 'Completed' && r.completedDate === today).length;
    const totalCompleted = this.serviceRequests.filter(r => r.status === 'Completed').length;

    return {
      totalMechanics,
      availableMechanics,
      totalRequests,
      pendingRequests,
      inProgressRequests,
      activeJobs,
      completedToday,
      totalCompleted
    };
  }

  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
  }
}
