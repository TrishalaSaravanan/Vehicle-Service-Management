import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LocalStorageService, User, Admin, Mechanic, Customer } from '../../services/local-storage.service';
import { AuthService, AuthResponse } from '../../services/auth.service';

@Component({
  selector: 'app-storage-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './storage-demo.component.html',
  styleUrl: './storage-demo.component.css'
})
export class StorageDemoComponent implements OnInit {
  currentUser: User | null = null;
  allUsers: User[] = [];
  admins: Admin[] = [];
  mechanics: Mechanic[] = [];
  customers: Customer[] = [];

  newUser = {
    name: '',
    email: '',
    password: '',
    role: '' as 'admin' | 'mechanic' | 'customer' | ''
  };

  loginResult: any = null;

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.currentUser = this.authService.getCurrentUser();
    this.allUsers = this.localStorageService.getUsers();
    this.admins = this.localStorageService.getAdmins();
    this.mechanics = this.localStorageService.getMechanics();
    this.customers = this.localStorageService.getCustomers();
  }

  toggleUserStatus(user: User) {
    user.isActive = !user.isActive;
    if (this.localStorageService.updateUser(user)) {
      this.refreshData();
      alert(`User ${user.isActive ? 'activated' : 'deactivated'} successfully!`);
    } else {
      alert('Failed to update user status');
    }
  }

  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      if (this.localStorageService.deleteUser(userId)) {
        this.refreshData();
        alert('User deleted successfully!');
      } else {
        alert('Failed to delete user');
      }
    }
  }

  addNewUser() {
    if (!this.isFormValid()) {
      alert('Please fill all required fields');
      return;
    }

    const userData = {
      ...this.newUser,
      role: this.newUser.role as 'admin' | 'mechanic' | 'customer',
      phone: '',
      address: '',
      isActive: true
    };

    const result = this.authService.register(userData);
    
    if (result.success) {
      this.refreshData();
      this.resetForm();
      alert('User added successfully!');
    } else {
      alert(result.message);
    }
  }

  isFormValid(): boolean {
    return !!(this.newUser.name && this.newUser.email && this.newUser.password && this.newUser.role);
  }

  resetForm() {
    this.newUser = {
      name: '',
      email: '',
      password: '',
      role: ''
    };
  }

  exportData() {
    const data = this.localStorageService.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mechniq-data.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  clearAllData() {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      this.localStorageService.clearAllData();
      this.authService.logout();
      this.refreshData();
      alert('All data cleared successfully!');
    }
  }

  resetToDefault() {
    if (confirm('Are you sure you want to reset to default data? This will overwrite all current data.')) {
      this.localStorageService.clearAllData();
      // The constructor will reinitialize default data
      window.location.reload();
    }
  }

  testLogin(email: string, password: string): void {
    console.log('Testing login for:', email);
    this.loginResult = this.authService.login({ email, password });
    
    if (this.loginResult.success) {
      this.currentUser = this.authService.getCurrentUser();
      console.log('Login successful, current user:', this.currentUser);
      console.log('Navigating to dashboard...');
      this.authService.navigateToDashboard();
    }
  }

  reinitializeUsers(): void {
    this.localStorageService.forceReinitializeUsers();
    this.loadData();
    this.loginResult = null;
  }

  logout(): void {
    this.authService.logout();
    this.currentUser = null;
    this.loginResult = null;
  }

  loadData(): void {
    this.allUsers = this.localStorageService.getUsers();
    this.admins = this.localStorageService.getAdmins();
    this.mechanics = this.localStorageService.getMechanics();
    this.customers = this.localStorageService.getCustomers();
    
    console.log('Loaded data:', {
      allUsers: this.allUsers,
      admins: this.admins,
      mechanics: this.mechanics,
      customers: this.customers
    });
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'mechanic':
        return 'bg-green-100 text-green-800';
      case 'customer':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
