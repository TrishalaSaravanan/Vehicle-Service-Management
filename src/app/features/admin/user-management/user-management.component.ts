import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalStorageService, Mechanic, User } from '../../../services/local-storage.service';

interface MechanicFormData extends Partial<Mechanic> {
  status?: 'Active' | 'Inactive';
}

interface CustomerFormData extends Partial<User> {
  status?: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-3xl font-bold text-gray-800">User Management</h2>
          <p class="text-gray-600">Manage all system users and mechanics</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="flex border-b border-gray-200 bg-white rounded-t-xl shadow-sm">
          <button 
            (click)="setActiveTab('customers')"
            [class]="getTabClasses('customers')"
            class="py-3 px-6 font-medium border-b-2 border-transparent hover:text-primary transition">
            <i class="fas fa-users mr-2"></i>Customers
          </button>
          <button 
            (click)="setActiveTab('mechanics')"
            [class]="getTabClasses('mechanics')"
            class="py-3 px-6 font-medium border-b-2 border-transparent hover:text-primary transition">
            <i class="fas fa-tools mr-2"></i>Mechanics
          </button>
        </div>
      </div>

      <!-- Customer Content -->
      <div *ngIf="activeTab === 'customers'" class="bg-white rounded-xl shadow-md">
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <div class="flex space-x-2">
              <input 
                type="text" 
                [(ngModel)]="customerSearch"
                placeholder="Search customers..." 
                class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
              <select 
                [(ngModel)]="customerFilter"
                class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button 
                (click)="searchCustomers()"
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition">
                <i class="fas fa-search mr-2"></i>Search
              </button>
            </div>
            <button 
              (click)="openCustomerModal()"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              <i class="fas fa-plus mr-2"></i>Add Customer
            </button>
          </div>
        </div>

        <!-- Customer Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let customer of paginatedCustomers">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{customer.id}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{customer.name}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{customer.email}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{customer.phone}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span [class]="getStatusClasses(customer.status)">
                    {{customer.status}}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button (click)="viewCustomer(customer)" class="text-blue-600 hover:text-blue-900 mr-3">
                    <i class="fas fa-eye mr-1"></i>View
                  </button>
                  <button (click)="editCustomer(customer)" class="text-yellow-600 hover:text-yellow-900 mr-3">
                    <i class="fas fa-edit mr-1"></i>Edit
                  </button>
                  <button (click)="deleteUser('customer', customer.id)" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash mr-1"></i>Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Customer Pagination -->
        <div class="flex justify-between items-center p-6 border-t border-gray-200">
          <div class="text-sm text-gray-500">
            Showing {{getStartIndex('customer')}} to {{getEndIndex('customer')}} of {{filteredCustomers.length}} customers
          </div>
          <div class="flex space-x-1">
            <button 
              (click)="previousPage('customer')" 
              [disabled]="currentCustomerPage === 1"
              class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button 
              *ngFor="let page of getPageNumbers('customer')"
              (click)="goToPage('customer', page)"
              [class]="getPageClasses('customer', page)"
              class="px-3 py-1 border rounded">
              {{page}}
            </button>
            <button 
              (click)="nextPage('customer')" 
              [disabled]="currentCustomerPage === getTotalPages('customer')"
              class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Mechanic Content -->
      <div *ngIf="activeTab === 'mechanics'" class="bg-white rounded-xl shadow-md">
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <div class="flex space-x-2">
              <input 
                type="text" 
                [(ngModel)]="mechanicSearch"
                placeholder="Search mechanics..." 
                class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
              <select 
                [(ngModel)]="mechanicFilter"
                class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button 
                (click)="searchMechanics()"
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition">
                <i class="fas fa-search mr-2"></i>Search
              </button>
            </div>
            <button 
              (click)="openMechanicModal()"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              <i class="fas fa-plus mr-2"></i>Add Mechanic
            </button>
          </div>
        </div>

        <!-- Mechanic Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let mechanic of paginatedMechanics">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{mechanic.id}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{mechanic.name}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{mechanic.email}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{mechanic.phone}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{mechanic.specialization}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span [class]="getStatusClasses(mechanic.status)">
                    {{mechanic.status}}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button (click)="viewMechanic(mechanic)" class="text-blue-600 hover:text-blue-900 mr-3">
                    <i class="fas fa-eye mr-1"></i>View
                  </button>
                  <button (click)="editMechanic(mechanic)" class="text-yellow-600 hover:text-yellow-900 mr-3">
                    <i class="fas fa-edit mr-1"></i>Edit
                  </button>
                  <button (click)="deleteUser('mechanic', mechanic.id)" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash mr-1"></i>Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mechanic Pagination -->
        <div class="flex justify-between items-center p-6 border-t border-gray-200">
          <div class="text-sm text-gray-500">
            Showing {{getStartIndex('mechanic')}} to {{getEndIndex('mechanic')}} of {{filteredMechanics.length}} mechanics
          </div>
          <div class="flex space-x-1">
            <button 
              (click)="previousPage('mechanic')" 
              [disabled]="currentMechanicPage === 1"
              class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button 
              *ngFor="let page of getPageNumbers('mechanic')"
              (click)="goToPage('mechanic', page)"
              [class]="getPageClasses('mechanic', page)"
              class="px-3 py-1 border rounded">
              {{page}}
            </button>
            <button 
              (click)="nextPage('mechanic')" 
              [disabled]="currentMechanicPage === getTotalPages('mechanic')"
              class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer Modal -->
    <div *ngIf="showCustomerModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">{{customerModalTitle}}</h3>
          <button (click)="closeCustomerModal()" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form (ngSubmit)="saveCustomer()" #customerForm="ngForm">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              type="text" 
              [(ngModel)]="customerFormData.name"
              name="customerName"
              required
              [disabled]="isEditMode"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              [(ngModel)]="customerFormData.email"
              name="customerEmail"
              required
              [disabled]="isEditMode"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input 
              type="text" 
              [(ngModel)]="customerFormData.phone"
              name="customerPhone"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea 
              [(ngModel)]="customerFormData.address"
              name="customerAddress"
              rows="3"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              [(ngModel)]="customerFormData.status"
              name="customerStatus"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div class="flex justify-end space-x-2">
            <button 
              type="button" 
              (click)="closeCustomerModal()"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button 
              type="submit"
              [disabled]="!customerForm.valid"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Mechanic Modal -->
    <div *ngIf="showMechanicModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">{{mechanicModalTitle}}</h3>
          <button (click)="closeMechanicModal()" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form (ngSubmit)="saveMechanic()" #mechanicForm="ngForm">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              type="text" 
              [(ngModel)]="mechanicFormData.name"
              name="mechanicName"
              required
              [disabled]="isEditMode"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              [(ngModel)]="mechanicFormData.email"
              name="mechanicEmail"
              required
              [disabled]="isEditMode"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input 
              type="text" 
              [(ngModel)]="mechanicFormData.phone"
              name="mechanicPhone"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
            <input 
              type="text" 
              [(ngModel)]="mechanicFormData.specialization"
              name="mechanicSpecialization"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              [(ngModel)]="mechanicFormData.status"
              name="mechanicStatus"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div class="flex justify-end space-x-2">
            <button 
              type="button" 
              (click)="closeMechanicModal()"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button 
              type="submit"
              [disabled]="!mechanicForm.valid"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Modal -->
    <div *ngIf="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">{{viewModalTitle}}</h3>
          <button (click)="closeViewModal()" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <h4 class="text-sm font-medium text-gray-500">Name</h4>
            <p class="mt-1 text-gray-900">{{viewData.name}}</p>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-500">Email</h4>
            <p class="mt-1 text-gray-900">{{viewData.email}}</p>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-500">Phone</h4>
            <p class="mt-1 text-gray-900">{{viewData.phone}}</p>
          </div>
          <div *ngIf="viewData.address">
            <h4 class="text-sm font-medium text-gray-500">Address</h4>
            <p class="mt-1 text-gray-900">{{viewData.address}}</p>
          </div>
          <div *ngIf="viewData.specialization">
            <h4 class="text-sm font-medium text-gray-500">Specialization</h4>
            <p class="mt-1 text-gray-900">{{viewData.specialization ? viewData.specialization.join(', ') : ''}}</p>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-500">Status</h4>
            <p class="mt-1 text-gray-900">{{viewData.status}}</p>
          </div>
        </div>
        <div class="flex justify-end space-x-2 mt-6">
          <button 
            (click)="editFromView()"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition">
            Edit
          </button>
          <button 
            (click)="closeViewModal()"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
            Back
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div *ngIf="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">Confirm Delete</h3>
          <button (click)="closeDeleteModal()" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <p class="mb-6">Are you sure you want to delete this {{deleteType}}?</p>
        <div class="flex justify-end space-x-2">
          <button 
            (click)="closeDeleteModal()"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button 
            (click)="confirmDelete()"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            Delete
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --primary: #1B4B88;
    }
    
    .tab-active {
      border-bottom-color: var(--primary) !important;
      color: var(--primary) !important;
    }
    
    .transition {
      transition: all 0.3s ease;
    }
  `]
})
export class UserManagementComponent implements OnInit {
  activeTab: 'customers' | 'mechanics' = 'customers';
  itemsPerPage = 10;
  
  // Customer data and pagination
  customers: (User & { status: string })[] = [];
  filteredCustomers: (User & { status: string })[] = [];
  paginatedCustomers: (User & { status: string })[] = [];
  currentCustomerPage = 1;
  customerSearch = '';
  customerFilter = '';
  
  // Mechanic data and pagination
  mechanics: (Mechanic & { status: 'Active' | 'Inactive' })[] = [];
  filteredMechanics: (Mechanic & { status: 'Active' | 'Inactive' })[] = [];
  paginatedMechanics: (Mechanic & { status: 'Active' | 'Inactive' })[] = [];
  currentMechanicPage = 1;
  mechanicSearch = '';
  mechanicFilter = '';
  
  // Modal states
  showCustomerModal = false;
  showMechanicModal = false;
  showViewModal = false;
  showDeleteModal = false;
  
  // Form data
  customerFormData: CustomerFormData = {};
  mechanicFormData: MechanicFormData = {};
  viewData: Partial<User & { specialization?: string[]; status?: string } > = {};
  
  // Modal titles and states
  customerModalTitle = 'Add Customer';
  mechanicModalTitle = 'Add Mechanic';
  viewModalTitle = '';
  isEditMode = false;
  deleteType = '';
  deleteId: string = '';

  constructor(private localStorage: LocalStorageService) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.loadMechanicsFromStorage();
    this.loadCustomersFromStorage();
    this.searchCustomers();
    this.searchMechanics();
  }

  loadInitialData(): void {
    // Only set hardcoded mechanics if local storage is empty
    if (!this.localStorage.getMechanics().length) {
      const initialMechanics = [
        { id: '1', name: 'Ramanan', email: 'ramanan@gmail.com', phone: '9122334455', specialization: ['Engine Repair'], status: 'Active', role: 'mechanic', experience: 5, certification: ['ASE Certified'], employeeId: 'EMP001', createdAt: new Date(), isActive: true, password: 'mechanic123', address: '' },
        { id: '2', name: 'Yogesh', email: 'yogesh@gmail.com', phone: '7233445566', specialization: ['Brake Systems'], status: 'Active', role: 'mechanic', experience: 4, certification: ['Brake Specialist'], employeeId: 'EMP002', createdAt: new Date(), isActive: true, password: 'mechanic123', address: '' },
        { id: '3', name: 'Harish', email: 'Harish@gmail.com', phone: '8344556677', specialization: ['Transmission'], status: 'Inactive', role: 'mechanic', experience: 6, certification: ['Transmission Expert'], employeeId: 'EMP003', createdAt: new Date(), isActive: false, password: 'mechanic123', address: '' },
        { id: '4', name: 'Kiruthik', email: 'Kiruthik@gmail.com', phone: '9455667788', specialization: ['Electrical Systems'], status: 'Active', role: 'mechanic', experience: 3, certification: ['Electrical Specialist'], employeeId: 'EMP004', createdAt: new Date(), isActive: true, password: 'mechanic123', address: '' },
        { id: '5', name: 'Saravanan', email: 'saravanan@gmail.com', phone: '9566778899', specialization: ['Suspension'], status: 'Active', role: 'mechanic', experience: 7, certification: ['Suspension Pro'], employeeId: 'EMP005', createdAt: new Date(), isActive: true, password: 'mechanic123', address: '' },
        { id: '6', name: 'Perumal', email: 'perumal@gmail.com', phone: '6677889900', specialization: ['AC Repair'], status: 'Inactive', role: 'mechanic', experience: 2, certification: ['AC Specialist'], employeeId: 'EMP006', createdAt: new Date(), isActive: false, password: 'mechanic123', address: '' }
      ];
      // Add mechanics to localStorage
      initialMechanics.forEach(m => this.localStorage.addUser({
        ...m,
        role: 'mechanic' as const
      }));
    }
    // Only set a hardcoded customer if local storage is empty
    if (!this.localStorage.getCustomers || !this.localStorage.getCustomers().length) {
      const initialCustomers = [
        { id: 'customer_1', name: 'John Doe', email: 'john@example.com', phone: '9876543210', address: '123 Main St', status: 'Active', role: 'customer', password: 'customer123', createdAt: new Date(), isActive: true }
      ];
      initialCustomers.forEach(c => this.localStorage.addUser({
        ...c,
        role: 'customer' as const,
        isActive: true
      }));
    }
  }

  loadCustomersFromStorage(): void {
    const storedCustomers = this.localStorage.getCustomers ? this.localStorage.getCustomers() : [];
    if (storedCustomers && storedCustomers.length > 0) {
      this.customers = storedCustomers.map(c => ({
        ...c,
        phone: c.phone ?? '',
        status: c.isActive ? 'Active' : 'Inactive'
      }));
      this.filteredCustomers = [...this.customers];
      this.updateCustomerPagination();
    }
  }

  loadMechanicsFromStorage(): void {
    const storedMechanics = this.localStorage.getMechanics();
    if (storedMechanics && storedMechanics.length > 0) {
      this.mechanics = storedMechanics.map(m => ({
        ...m,
        phone: m.phone ?? '',
        status: m.isActive ? 'Active' : 'Inactive'
      }));
      this.filteredMechanics = [...this.mechanics];
      this.updateMechanicPagination();
    }
  }

  // Tab management
  setActiveTab(tab: 'customers' | 'mechanics'): void {
    this.activeTab = tab;
  }

  getTabClasses(tab: string): string {
    return this.activeTab === tab ? 'tab-active border-b-2 border-primary text-primary' : '';
  }

  // Search and filter functions
  searchCustomers(): void {
    let filtered = this.customers;

    if (this.customerSearch) {
      const searchTerm = this.customerSearch.toLowerCase();
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm) ||
        (customer.phone && customer.phone.includes(searchTerm))
      );
    }

    if (this.customerFilter) {
      filtered = filtered.filter(customer => customer.status === this.customerFilter);
    }

    this.filteredCustomers = filtered;
    this.currentCustomerPage = 1;
    this.updateCustomerPagination();
  }

  searchMechanics(): void {
    let filtered = [...this.mechanics];

    if (this.mechanicSearch) {
      const searchTerm = this.mechanicSearch.toLowerCase();
      filtered = filtered.filter(mechanic => 
        mechanic.name.toLowerCase().includes(searchTerm) ||
        mechanic.email.toLowerCase().includes(searchTerm) ||
        (mechanic.phone && mechanic.phone.includes(searchTerm)) ||
        mechanic.specialization.join(',').toLowerCase().includes(searchTerm)
      );
    }

    if (this.mechanicFilter) {
      filtered = filtered.filter(mechanic => mechanic.status === this.mechanicFilter);
    }

    this.filteredMechanics = filtered;
    this.currentMechanicPage = 1;
    this.updateMechanicPagination();
  }

  // Pagination functions
  updateCustomerPagination(): void {
    const startIndex = (this.currentCustomerPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredCustomers.length);
    this.paginatedCustomers = this.filteredCustomers.slice(startIndex, endIndex);
  }

  updateMechanicPagination(): void {
    const startIndex = (this.currentMechanicPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredMechanics.length);
    this.paginatedMechanics = this.filteredMechanics.slice(startIndex, endIndex);
  }

  getTotalPages(type: string): number {
    const totalItems = type === 'customer' ? this.filteredCustomers.length : this.filteredMechanics.length;
    return Math.ceil(totalItems / this.itemsPerPage);
  }

  getPageNumbers(type: string): number[] {
    const totalPages = this.getTotalPages(type);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  getPageClasses(type: string, page: number): string {
    const currentPage = type === 'customer' ? this.currentCustomerPage : this.currentMechanicPage;
    return currentPage === page ? 'bg-primary text-white' : 'hover:bg-gray-100';
  }

  goToPage(type: string, page: number): void {
    if (type === 'customer') {
      this.currentCustomerPage = page;
      this.updateCustomerPagination();
    } else {
      this.currentMechanicPage = page;
      this.updateMechanicPagination();
    }
  }

  previousPage(type: string): void {
    if (type === 'customer' && this.currentCustomerPage > 1) {
      this.currentCustomerPage--;
      this.updateCustomerPagination();
    } else if (type === 'mechanic' && this.currentMechanicPage > 1) {
      this.currentMechanicPage--;
      this.updateMechanicPagination();
    }
  }

  nextPage(type: string): void {
    const totalPages = this.getTotalPages(type);
    if (type === 'customer' && this.currentCustomerPage < totalPages) {
      this.currentCustomerPage++;
      this.updateCustomerPagination();
    } else if (type === 'mechanic' && this.currentMechanicPage < totalPages) {
      this.currentMechanicPage++;
      this.updateMechanicPagination();
    }
  }

  getStartIndex(type: string): number {
    const currentPage = type === 'customer' ? this.currentCustomerPage : this.currentMechanicPage;
    return (currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(type: string): number {
    const currentPage = type === 'customer' ? this.currentCustomerPage : this.currentMechanicPage;
    const totalItems = type === 'customer' ? this.filteredCustomers.length : this.filteredMechanics.length;
    return Math.min(currentPage * this.itemsPerPage, totalItems);
  }

  // Utility functions
  getStatusClasses(status: string): string {
    return status === 'Active' 
      ? 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'
      : 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800';
  }

  // Customer modal functions
  openCustomerModal(): void {
    this.customerModalTitle = 'Add Customer';
    this.isEditMode = false;
    this.customerFormData = { status: 'Active' };
    this.showCustomerModal = true;
  }

  editCustomer(customer: User): void {
    this.customerModalTitle = 'Edit Customer';
    this.isEditMode = true;
    this.customerFormData = { ...customer };
    this.showCustomerModal = true;
  }

  saveCustomer(): void {
    if (this.isEditMode) {
      const index = this.customers.findIndex(c => c.id === this.customerFormData.id);
      if (index !== -1) {
        this.customers[index] = {
          ...this.customerFormData,
          status: this.customerFormData.status || 'Active'
        } as User & { status: string };
        // Update in localStorage
        this.localStorage.updateUser({
          ...this.customers[index],
          role: 'customer',
          isActive: this.customers[index].status === 'Active',
          createdAt: this.customers[index].createdAt || new Date(),
          password: this.customers[index].password || 'customer123'
        });
      }
    } else {
      // When adding a new customer, use a string ID
      const newId = 'customer_' + Date.now();
      const newCustomer = {
        ...this.customerFormData,
        id: newId,
        status: this.customerFormData.status || 'Active',
        role: 'customer',
        isActive: (this.customerFormData.status || 'Active') === 'Active',
        createdAt: new Date(),
        password: 'customer123'
      } as User & { status: string };
      this.customers.push(newCustomer);
      // Add to localStorage
      this.localStorage.addUser(newCustomer);
    }
    this.closeCustomerModal();
    this.searchCustomers();
  }

  closeCustomerModal(): void {
    this.showCustomerModal = false;
    this.customerFormData = {};
    this.isEditMode = false;
  }

  // Mechanic modal functions
  openMechanicModal(): void {
    this.mechanicModalTitle = 'Add Mechanic';
    this.isEditMode = false;
    this.mechanicFormData = { status: 'Active' };
    this.showMechanicModal = true;
  }

  editMechanic(mechanic: Mechanic & { status: 'Active' | 'Inactive' }): void {
    this.mechanicFormData = {
      ...mechanic,
      phone: mechanic.phone ?? '',
      role: 'mechanic',
      status: mechanic.status
    };
    this.mechanicModalTitle = 'Edit Mechanic';
    this.isEditMode = true;
    this.showMechanicModal = true;
  }

  // Add Mechanic
  saveMechanic(): void {
    if (this.isEditMode) {
      // Update existing mechanic
      const updatedMechanic: Mechanic = {
        ...(this.mechanicFormData as any),
        id: String(this.mechanicFormData.id),
        name: this.mechanicFormData.name || '',
        email: this.mechanicFormData.email || '',
        password: (this.mechanicFormData as any).password || 'mechanic123',
        phone: this.mechanicFormData.phone || '',
        address: '',
        role: 'mechanic',
        createdAt: new Date(),
        isActive: this.mechanicFormData.status === 'Active',
        specialization: this.mechanicFormData.specialization || [],
        experience: Number(this.mechanicFormData.experience) || 0,
        certification: [],
        employeeId: (this.mechanicFormData as any).employeeId || 'EMP' + Math.floor(Math.random() * 10000)
      };
      
      const updated = this.localStorage.updateUser(updatedMechanic);
      if (updated) {
        this.loadMechanicsFromStorage();
        this.searchMechanics();
        this.closeMechanicModal();
      }
    } else {
      // Add new mechanic
      const newMechanic: Mechanic = {
        id: 'mechanic_' + Date.now(),
        name: this.mechanicFormData.name || '',
        email: this.mechanicFormData.email || '',
        password: 'mechanic123',
        phone: this.mechanicFormData.phone || '',
        address: '',
        role: 'mechanic',
        createdAt: new Date(),
        isActive: this.mechanicFormData.status === 'Active',
        specialization: this.mechanicFormData.specialization || [],
        experience: Number(this.mechanicFormData.experience) || 0,
        certification: [],
        employeeId: 'EMP' + Math.floor(Math.random() * 10000)
      };
      
      const added = this.localStorage.addUser(newMechanic);
      if (added) {
        this.loadMechanicsFromStorage();
        this.searchMechanics();
        this.closeMechanicModal();
      }
    }
  }

  closeMechanicModal(): void {
    this.showMechanicModal = false;
    this.isEditMode = false;
    this.mechanicFormData = {};
  }

  // View modal functions
  viewCustomer(customer: User): void {
    this.viewModalTitle = 'Customer Details';
    this.viewData = { ...customer };
    this.showViewModal = true;
  }

  viewMechanic(mechanic: User): void {
    this.viewModalTitle = 'Mechanic Details';
    this.viewData = { ...mechanic };
    this.showViewModal = true;
  }

  editFromView(): void {
    const userData = this.viewData;
    this.closeViewModal();
    
    if (this.viewModalTitle.includes('Customer')) {
      this.customerModalTitle = 'Edit Customer';
      this.isEditMode = true;
      this.customerFormData = {
        ...userData,
        status: (userData as any).status || 'Active'
      };
      this.showCustomerModal = true;
    } else {
      this.mechanicModalTitle = 'Edit Mechanic';
      this.isEditMode = true;
      this.mechanicFormData = {
        ...userData,
        role: 'mechanic',
        status: (userData as any).status || 'Active'
      } as MechanicFormData;
      this.showMechanicModal = true;
    }
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.viewData = {};
  }

  // Delete functions
  deleteUser(type: string, id: string): void {
    this.deleteType = type;
    this.deleteId = id;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.deleteType === 'customer') {
      this.customers = this.customers.filter(c => c.id !== this.deleteId);
      this.localStorage.deleteUser(this.deleteId);
      this.searchCustomers();
    } else if (this.deleteType === 'mechanic') {
      this.mechanics = this.mechanics.filter(m => m.id !== this.deleteId);
      this.localStorage.deleteUser(this.deleteId);
      this.searchMechanics();
    }
    this.closeDeleteModal();
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.deleteType = '';
    this.deleteId = '';
  }
}
