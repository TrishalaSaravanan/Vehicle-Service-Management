import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  constructor(private router: Router) {}

  navigateHome() {
    this.router.navigate(['/customer/home']);
  }

  navigateToEditProfile() {
    this.router.navigate(['/customer/profile/edit']);
  }
}
