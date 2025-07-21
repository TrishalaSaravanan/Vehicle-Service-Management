import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {
  profile = {
    name: 'Trishala Saravanan',
    email: 'trishalasaravanan@gmail.com',
    address: '9,D.H.O STREET, VENGAMEDU,KARUR.',
    phone: '9345260068'
  };
  passwords = { current: '', new: '', confirm: '' };
  showPassword = { current: false, new: false, confirm: false };
  showToast = false;
  toastMessage = '';
  showError = false;
  errorMessage = '';

  constructor(private router: Router) {}

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm') {
    this.showPassword[field] = !this.showPassword[field];
  }

  navigateToProfile() {
    this.router.navigate(['/customer/profile']);
  }

  onSubmit() {
    this.showError = false;
    this.errorMessage = '';
    // Password validation
    if (this.passwords.new && this.passwords.new !== this.passwords.confirm) {
      this.showError = true;
      this.errorMessage = "New passwords don't match!";
      return;
    }
    // Simulate save
    this.showToast = true;
    this.toastMessage = 'Profile updated successfully!';
    setTimeout(() => {
      this.showToast = false;
      this.navigateToProfile();
    }, 2000);
  }
}
