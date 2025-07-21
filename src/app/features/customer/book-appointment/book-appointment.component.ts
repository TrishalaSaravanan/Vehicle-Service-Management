
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, NgFor, NgIf, DecimalPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, DecimalPipe, NgClass, FormsModule],
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css']
})
export class BookAppointmentComponent {
  errorMessage: string = '';
  step = 1;
  showAddVehicle = false;
  showProcessing = false;
  showSuccess = false;

  vehicles = [
    { id: 1, brand: 'Toyota', model: 'Camry', year: 2020, licensePlate: 'ABC-1234', mileage: 45320 },
    { id: 2, brand: 'Honda', model: 'City', year: 2018, licensePlate: 'XYZ-5678', mileage: 78450 }
  ];
  selectedVehicle: any = null;
  newVehicle = { brand: '', model: '', year: 2024, licensePlate: '', mileage: 0 };

  services = [
    { id: 1, name: 'Oil Change', price: 1500, duration: '30 min', description: 'Recommended every 5,000 km', selected: false },
    { id: 2, name: 'Tire Rotation', price: 800, duration: '45 min', description: 'Recommended every 10,000 km', selected: false },
    { id: 3, name: 'Brake Inspection', price: 1200, duration: '1 hour', description: 'Recommended annually', selected: false },
    { id: 4, name: 'Battery Check', price: 600, duration: '20 min', description: 'Recommended every 6 months', selected: false },
    { id: 5, name: 'AC Service', price: 1800, duration: '1.5 hours', description: 'Recommended before summer', selected: false },
    { id: 6, name: 'Wheel Alignment', price: 1000, duration: '45 min', description: 'Recommended every 10,000 km', selected: false },
    { id: 7, name: 'Engine Tune-up', price: 2500, duration: '2 hours', description: 'Recommended every 20,000 km', selected: false },
    { id: 8, name: 'Transmission Service', price: 3000, duration: '2.5 hours', description: 'Recommended every 30,000 km', selected: false },
    { id: 9, name: 'Coolant Flush', price: 1500, duration: '1 hour', description: 'Recommended every 2 years', selected: false },
    { id: 10, name: 'Full Car Wash', price: 500, duration: '30 min', description: 'Exterior wash and interior vacuum', selected: false }
  ];

  appointmentDate: string = '';
  appointmentTime: string = '';
  minDate: string = '';
  timeSlots: string[] = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  constructor(private router: Router) {
    // Set min date to tomorrow
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    this.minDate = tomorrow.toISOString().split('T')[0];
  }

  goToStep(step: number) {
    this.errorMessage = '';
    // Always allow going back
    if (step < this.step) {
      this.step = step;
      window.scrollTo(0, 0);
      return;
    }
    // Validation for forward navigation
    if (step === 2 && !this.selectedVehicle) {
      this.errorMessage = 'Please choose a vehicle before proceeding.';
      return;
    }
    if (step === 3 && !this.services.some(s => s.selected)) {
      this.errorMessage = 'Please choose at least one service before proceeding.';
      return;
    }
    this.step = step;
    window.scrollTo(0, 0);
  }

  selectVehicle(vehicle: any) {
    this.selectedVehicle = vehicle;
    this.showAddVehicle = false;
  }

  addNewVehicle() {
    if (!this.newVehicle.brand || !this.newVehicle.model || !this.newVehicle.year || !this.newVehicle.licensePlate || !this.newVehicle.mileage) {
      alert('Please fill all vehicle details');
      return;
    }
    const newId = Date.now();
    const vehicle = { ...this.newVehicle, id: newId };
    this.vehicles.push(vehicle);
    this.selectedVehicle = vehicle;
    this.newVehicle = { brand: '', model: '', year: 2024, licensePlate: '', mileage: 0 };
    this.showAddVehicle = false;
  }

  toggleService(service: any) {
    service.selected = !service.selected;
  }

  selectTimeSlot(slot: string) {
    this.appointmentTime = slot;
  }

  getTotalPrice() {
    return this.services.filter(s => s.selected).reduce((sum, s) => sum + s.price, 0);
  }

  confirmBooking() {
    if (!this.selectedVehicle) {
      alert('Please select a vehicle');
      this.goToStep(1);
      return;
    }
    if (!this.services.some(s => s.selected)) {
      alert('Please select at least one service');
      this.goToStep(2);
      return;
    }
    if (!this.appointmentDate) {
      alert('Please select a date');
      return;
    }
    if (!this.appointmentTime) {
      alert('Please select a time slot');
      return;
    }
    // Store appointment in browser localStorage directly
    const appointment = {
      id: Date.now().toString(),
      vehicleId: this.selectedVehicle.id,
      vehicle: this.selectedVehicle,
      services: this.services.filter(s => s.selected),
      date: this.appointmentDate,
      time: this.appointmentTime,
      status: 'Pending',
      notes: ''
    };
    const appointments = JSON.parse(localStorage.getItem('mechniq_appointments') || '[]');
    appointments.push(appointment);
    localStorage.setItem('mechniq_appointments', JSON.stringify(appointments));
    this.showProcessing = true;
    setTimeout(() => {
      this.showProcessing = false;
      this.showSuccess = true;
    }, 2000);
  }

  redirectToAppointments() {
    this.showSuccess = false;
    this.router.navigate(['/customer/appointments']);
  }

  goToDashboard() {
    this.router.navigate(['/customer/home']);
  }

  navigateHome() {
    this.router.navigate(['/customer/dashboard']);
  }
}
