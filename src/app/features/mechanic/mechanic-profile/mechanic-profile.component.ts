import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mechanic-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mechanic-profile.component.html',
  styleUrls: ['./mechanic-profile.component.css']
})
export class MechanicProfileComponent {
  mechanic = {
    name: 'Bennet',
    email: 'bennet@mechniq.com',
    phone: '+1 (555) 123-4567',
    specialization: 'Engine Repair',
    experience: '8 years',
    certification: 'ASE Certified Master Technician',
    location: 'Main Workshop'
  };

  isEditing = false;
  editData = { ...this.mechanic };

  constructor(private router: Router) {}

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.editData = { ...this.mechanic };
    }
  }

  saveProfile(): void {
    // Here you would typically call a service to update the profile
    this.mechanic = { ...this.editData };
    this.isEditing = false;
    alert('Profile updated successfully!');
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editData = { ...this.mechanic };
  }

  goBack(): void {
    this.router.navigate(['/mechanic/dashboard']);
  }
}
