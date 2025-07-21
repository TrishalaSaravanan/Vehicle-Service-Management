import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-appointments',
  standalone: true,
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
  imports: [NgFor, NgClass, NgIf]
})
export class AppointmentsComponent implements OnInit, OnDestroy {
  appointments: any[] = [];
  private routerSubscription: Subscription;
  constructor(private router: Router) {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadAppointments();
      }
    });
  }

  ngOnInit(): void {
    this.loadAppointments();
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  loadAppointments() {
    // Get all appointments from localStorage
    const appointments = JSON.parse(localStorage.getItem('mechniq_appointments') || '[]');
    this.appointments = appointments;
  }

  navigateHome() {
    this.router.navigate(['/customer/home']);
  }

  navigateToBookAppointment() {
    this.router.navigate(['/customer/book-appointment']);
  }
}
