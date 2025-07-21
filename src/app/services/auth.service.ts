import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService, User } from './local-storage.service';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

interface CustomerProfile {
  id: string;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    // Check if user is already logged in
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const currentUser = this.localStorageService.getCurrentUser();
    if (currentUser) {
      this.currentUserSubject.next(currentUser);
      this.isAuthenticatedSubject.next(true);
    }
  }

  // Login method
  login(credentials: LoginCredentials): AuthResponse {
    try {
      console.log('Attempting login with:', credentials.email);
      const user = this.localStorageService.validateUser(credentials.email, credentials.password);
      
      if (user) {
        console.log('User authenticated successfully:', user);
        // Set current user in local storage and service
        this.localStorageService.setCurrentUser(user);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
        
        // Generate a simple token (in real app, this would come from backend)
        const token = this.generateToken(user);
        
        console.log('Login successful, user role:', user.role);
        return {
          success: true,
          message: 'Login successful',
          user: user,
          token: token
        };
      } else {
        console.log('Authentication failed for:', credentials.email);
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login'
      };
    }
  }

  // Logout method
  logout(): void {
    this.localStorageService.clearCurrentUser();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Get current user role
  getCurrentUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  // Navigate to appropriate dashboard based on role
  async navigateToDashboard(): Promise<boolean> {
    const user = this.getCurrentUser();
    console.log('Navigating to dashboard for user:', user);
    
    if (!user) {
      console.log('No user found, redirecting to login');
      return await this.router.navigate(['/login']);
    }

    console.log('User role:', user.role);
    let navigationResult: boolean;
    
    switch (user.role) {
      case 'admin':
        console.log('Navigating to admin dashboard');
        navigationResult = await this.router.navigate(['/admin/dashboard']);
        break;
      case 'mechanic':
        console.log('Navigating to mechanic dashboard');
        navigationResult = await this.router.navigate(['/mechanic/dashboard']);
        break;
      case 'customer':
        console.log('Navigating to customer home');
        navigationResult = await this.router.navigate(['/customer/home']);
        break;
      default:
        console.log('Unknown role, redirecting to login');
        navigationResult = await this.router.navigate(['/login']);
    }
    
    console.log('Navigation result:', navigationResult);
    return navigationResult;
  }

  // Generate a simple token (in real app, this would be JWT from backend)
  private generateToken(user: User): string {
    const tokenData = {
      userId: user.id,
      email: user.email,
      role: user.role,
      timestamp: Date.now()
    };
    return btoa(JSON.stringify(tokenData));
  }

  // Decode token
  decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token));
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Register new user
  register(userData: Omit<User, 'id' | 'createdAt'>): AuthResponse {
    try {
      const newUser: User = {
        ...userData,
        id: this.generateUserId(userData.role),
        createdAt: new Date(),
        isActive: true
      };

      const success = this.localStorageService.addUser(newUser);
      
      if (success) {
        return {
          success: true,
          message: 'Registration successful',
          user: newUser
        };
      } else {
        return {
          success: false,
          message: 'User with this email already exists'
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'An error occurred during registration'
      };
    }
  }

  // Generate user ID based on role
  private generateUserId(role: string): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${role}_${timestamp}_${random}`;
  }

  // Update user profile
  updateProfile(userData: Partial<User>): AuthResponse {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          message: 'No user logged in'
        };
      }

      const updatedUser: User = {
        ...currentUser,
        ...userData,
        id: currentUser.id, // Keep original ID
        createdAt: currentUser.createdAt // Keep original creation date
      };

      const success = this.localStorageService.updateUser(updatedUser);
      
      if (success) {
        this.localStorageService.setCurrentUser(updatedUser);
        this.currentUserSubject.next(updatedUser);
        
        return {
          success: true,
          message: 'Profile updated successfully',
          user: updatedUser
        };
      } else {
        return {
          success: false,
          message: 'Failed to update profile'
        };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        message: 'An error occurred while updating profile'
      };
    }
  }

  // Change password
  changePassword(currentPassword: string, newPassword: string): AuthResponse {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        return {
          success: false,
          message: 'No user logged in'
        };
      }

      if (user.password !== currentPassword) {
        return {
          success: false,
          message: 'Current password is incorrect'
        };
      }

      const updatedUser: User = {
        ...user,
        password: newPassword
      };

      const success = this.localStorageService.updateUser(updatedUser);
      
      if (success) {
        this.localStorageService.setCurrentUser(updatedUser);
        this.currentUserSubject.next(updatedUser);
        
        return {
          success: true,
          message: 'Password changed successfully'
        };
      } else {
        return {
          success: false,
          message: 'Failed to change password'
        };
      }
    } catch (error) {
      console.error('Password change error:', error);
      return {
        success: false,
        message: 'An error occurred while changing password'
      };
    }
  }

  // Get predefined users for demo
  getPredefinedUsers(): { [key: string]: { password: string; role: string; name: string } } {
    return {
      'admin@mechniq.com': {
        password: 'admin123',
        role: 'admin',
        name: 'System Administrator'
      },
      'mechanic@mechniq.com': {
        password: 'mechanic123',
        role: 'mechanic',
        name: 'John Smith'
      },
      'customer@mechniq.com': {
        password: 'customer123',
        role: 'customer',
        name: 'Profile'
      }
    };
  }

  // Validate session
  validateSession(): boolean {
    const user = this.localStorageService.getCurrentUser();
    if (user && user.isActive) {
      return true;
    } else {
      this.logout();
      return false;
    }
  }

  // Get customer profile
  async getCustomerProfile(): Promise<CustomerProfile> {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    // Return the basic profile information from the current user
    return {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email
    };
  }
}
