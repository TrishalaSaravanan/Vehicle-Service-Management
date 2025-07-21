import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  // Form model
  signupData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  // Error messages
  errors = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  // Password visibility toggles
  showPassword = false;
  showConfirmPassword = false;

  constructor(private router: Router) {}

  // Validate name
  validateName() {
    if (!this.signupData.name.trim()) {
      this.errors.name = 'Full name is required';
      return false;
    } else if (this.signupData.name.trim().length < 3) {
      this.errors.name = 'Name must be at least 3 characters';
      return false;
    } else {
      this.errors.name = '';
      return true;
    }
  }

  // Validate email
  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!this.signupData.email.trim()) {
      this.errors.email = 'Email is required';
      return false;
    } else if (!emailRegex.test(this.signupData.email.trim())) {
      this.errors.email = 'Please enter a valid email';
      return false;
    } else {
      this.errors.email = '';
      return true;
    }
  }

  // Validate password
  validatePassword() {
    if (!this.signupData.password) {
      this.errors.password = 'Password is required';
      return false;
    } else if (this.signupData.password.length < 8) {
      this.errors.password = 'Password must be at least 8 characters';
      return false;
    } else {
      this.errors.password = '';
      // Re-validate confirm password if needed
      if (this.signupData.confirmPassword) {
        this.validateConfirmPassword();
      }
      return true;
    }
  }

  // Validate confirm password
  validateConfirmPassword() {
    if (!this.signupData.confirmPassword) {
      this.errors.confirmPassword = 'Please confirm your password';
      return false;
    } else if (this.signupData.password !== this.signupData.confirmPassword) {
      this.errors.confirmPassword = 'Passwords do not match';
      return false;
    } else {
      this.errors.confirmPassword = '';
      return true;
    }
  }

  // Toggle password visibility
  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  // Handle form submission
  onSubmit() {
    const isNameValid = this.validateName();
    const isEmailValid = this.validateEmail();
    const isPasswordValid = this.validatePassword();
    const isConfirmPasswordValid = this.validateConfirmPassword();

    if (isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
      // Form is valid - proceed with submission
      alert('Account created successfully!');
      this.router.navigate(['/login']);
    }
  }
}