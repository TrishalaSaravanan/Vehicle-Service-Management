import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent {
  showAddModal = false;
  showSuccessModal = false;
  newVehicle = { brand: '', model: '', year: '', licensePlate: '', mileage: '' };

  constructor(private router: Router) {}

  navigateHome() {
    this.router.navigate(['/customer/home']);
  }

  showAddVehicleModal() {
    this.showAddModal = true;
  }

  closeModal() {
    this.showAddModal = false;
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  onAddVehicle() {
    this.showAddModal = false;
    this.showSuccessModal = true;
    // Here you would typically send the data to your server
  }
}
