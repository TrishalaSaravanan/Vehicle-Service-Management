import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FileUrlPipe } from './file-url.pipe';

interface WorkOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  vehicleInfo: string;
  vin: string;
  mileage: number;
  licensePlate: string;
  serviceType: string;
  description: string;
  status: string;
  dueDate: string;
  createdDate: string;
  assignedMechanic: string;
  estimatedCost: number;
  actualCost?: number;
  priority: string;
  requiredParts: Part[];
  statusHistory: StatusEvent[];
  partsUsed?: string[];
  hoursWorked?: string;
  images?: any[];
}

interface Part {
  id: string;
  name: string;
  partNumber: string;
  quantity: number;
  cost?: number;
  status: string;
  supplier: string;
  estimatedDelivery: string;
}

interface StatusEvent {
  date: string;
  action: string;
  details: string;
  performedBy: string;
}

@Component({
  selector: 'app-work-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FileUrlPipe],
  templateUrl: './work-orders.component.html',
  styleUrls: ['./work-orders.component.css']
})
export class WorkOrdersComponent implements OnInit {
  workOrders: WorkOrder[] = [];
  filteredOrders: WorkOrder[] = [];
  paginatedOrders: WorkOrder[] = [];
  
  // Search and filter properties
  searchTerm: string = '';
  selectedStatus: string = '';
  selectedMechanic: string = '';
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  
  // Modal properties
  selectedOrder: WorkOrder | null = null;
  showOrderDetailsModal: boolean = false;
  showAcceptModal: boolean = false;
  showPartsModal: boolean = false;
  showLogoutModal: boolean = false;
  showUpdateModal: boolean = false;
  
  // UI state
  showMobileMenu: boolean = false;
  showNotifications: boolean = false;
  
  // Form data
  customerNotification: string = '';

  // Update modal state
  updateHoursWorked: string = '';
  updateSelectedPart: string = '';
  updatePartsUsed: string[] = [];
  updateNotes: string = '';
  updateImages: any[] = [];

  // Available parts for the mechanic to choose from
  availableParts: string[] = ['Synthetic Oil 5W-30', 'Oil Filter', 'Brake Pads', 'AC Refrigerant'];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadWorkOrders();
    this.filterWorkOrders();
  }

  loadWorkOrders() {
    // Mock data - replace with actual API call
    this.workOrders = [
      {
        id: '1',
        orderNumber: 'WO-2024-001',
        customerName: 'Trishala',
        customerPhone: '9345260068',
        customerEmail: 'trishala@example.com',
        customerAddress: 'Coimbatore',
        vehicleInfo: '2020 Honda Civic',
        vin: '1HGBH41JXMN109186',
        mileage: 45000,
        licensePlate: 'ABC-1234',
        serviceType: 'Oil Change',
        description: 'Regular oil change and inspection',
        status: 'pending',
        dueDate: '2024-01-15',
        createdDate: '2024-01-10',
        assignedMechanic: 'Bennet',
        estimatedCost: 80,
        priority: 'normal',
        requiredParts: [
          {
            id: '1',
            name: 'Oil Filter',
            partNumber: 'OF-001',
            quantity: 1,
            cost: 15,
            status: 'in_stock',
            supplier: 'AutoParts Inc',
            estimatedDelivery: '2024-01-12'
          },
          {
            id: '2',
            name: 'Motor Oil 5W-30',
            partNumber: 'MO-5W30',
            quantity: 5,
            cost: 25,
            status: 'in_stock',
            supplier: 'AutoParts Inc',
            estimatedDelivery: '2024-01-12'
          }
        ],
        statusHistory: [
          {
            date: '2024-01-10',
            action: 'Order Created',
            details: 'Work order created by customer',
            performedBy: 'System'
          }
        ]
      },
      {
        id: '2',
        orderNumber: 'WO-2024-002',
        customerName: 'Sarah',
        customerPhone: '9473623568',
        customerEmail: 'sarah@example.com',
        customerAddress: '456 Oak Ave, City, State 12345',
        vehicleInfo: '2019 Toyota Camry',
        vin: '4T1BF1FK5KU123456',
        mileage: 62000,
        licensePlate: 'XYZ-5678',
        serviceType: 'Brake Service',
        description: 'Brake pads replacement and rotor resurfacing',
        status: 'in_progress',
        dueDate: '2024-01-20',
        createdDate: '2024-01-08',
        assignedMechanic: 'Bennet',
        estimatedCost: 350,
        priority: 'high',
        requiredParts: [
          {
            id: '3',
            name: 'Brake Pads (Front)',
            partNumber: 'BP-FRT-001',
            quantity: 1,
            cost: 120,
            status: 'ordered',
            supplier: 'BrakeParts Co',
            estimatedDelivery: '2024-01-18'
          }
        ],
        statusHistory: [
          {
            date: '2024-01-08',
            action: 'Order Created',
            details: 'Work order created by customer',
            performedBy: 'System'
          },
          {
            date: '2024-01-12',
            action: 'Work Started',
            details: 'Mechanic started working on the vehicle',
            performedBy: 'Bennet'
          }
        ]
      },
      {
        id: '3',
        orderNumber: 'WO-2024-003',
        customerName: 'kumar',
        customerPhone: '9554567890',
        customerEmail: 'kumar@example.com',
        customerAddress: '789 Pine St, City, State 12345',
        vehicleInfo: '2021 Ford F-150',
        vin: '1FTFW1ET5DFA12345',
        mileage: 28000,
        licensePlate: 'DEF-9012',
        serviceType: 'Transmission Service',
        description: 'Transmission fluid change and filter replacement',
        status: 'waiting_for_parts',
        dueDate: '2024-01-25',
        createdDate: '2024-01-05',
        assignedMechanic: 'Raj',
        estimatedCost: 450,
        priority: 'normal',
        requiredParts: [
          {
            id: '4',
            name: 'Transmission Filter',
            partNumber: 'TF-001',
            quantity: 1,
            cost: 45,
            status: 'shipped',
            supplier: 'TransParts Ltd',
            estimatedDelivery: '2024-01-22'
          }
        ],
        statusHistory: [
          {
            date: '2024-01-05',
            action: 'Order Created',
            details: 'Work order created by customer',
            performedBy: 'System'
          },
          {
            date: '2024-01-10',
            action: 'Parts Ordered',
            details: 'Required parts have been ordered',
            performedBy: 'Alex'
          }
        ]
      },
      {
        id: '4',
        orderNumber: 'WO-2024-004',
        customerName: 'Dhyan',
        customerPhone: '8746597365',
        customerEmail: 'dhyan@example.com',
        customerAddress: '321 Elm St, City, State 12345',
        vehicleInfo: '2018 Nissan Altima',
        vin: '1N4AL3AP5JC123456',
        mileage: 78000,
        licensePlate: 'GHI-3456',
        serviceType: 'AC Service',
        description: 'Air conditioning system repair and refrigerant recharge',
        status: 'completed',
        dueDate: '2024-01-12',
        createdDate: '2024-01-02',
        assignedMechanic: 'bennet',
        estimatedCost: 280,
        actualCost: 265,
        priority: 'high',
        requiredParts: [
          {
            id: '5',
            name: 'AC Refrigerant',
            partNumber: 'ACR-001',
            quantity: 2,
            cost: 60,
            status: 'installed',
            supplier: 'CoolParts Inc',
            estimatedDelivery: '2024-01-08'
          }
        ],
        statusHistory: [
          {
            date: '2024-01-02',
            action: 'Order Created',
            details: 'Work order created by customer',
            performedBy: 'System'
          },
          {
            date: '2024-01-08',
            action: 'Work Started',
            details: 'Mechanic started working on the vehicle',
            performedBy: 'Sarah'
          },
          {
            date: '2024-01-12',
            action: 'Work Completed',
            details: 'All work completed successfully',
            performedBy: 'Sarah'
          }
        ]
      }
    ];
  }

  filterWorkOrders() {
    this.filteredOrders = this.workOrders.filter(order => {
      const matchesSearch = !this.searchTerm || 
        order.orderNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.vehicleInfo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.serviceType.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.selectedStatus || order.status === this.selectedStatus;
      const matchesMechanic = !this.selectedMechanic || order.assignedMechanic === this.selectedMechanic;
      
      return matchesSearch && matchesStatus && matchesMechanic;
    });
    
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedOrders();
  }

  updatePaginatedOrders() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
  }

  // UI Methods
  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  // Filter and pagination methods
  applyFilters() {
    this.filterWorkOrders();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedOrders();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedOrders();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedOrders();
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getStartIndex(): number {
    return ((this.currentPage - 1) * this.itemsPerPage) + 1;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredOrders.length);
  }

  // Status styling methods
  getStatusClass(status: string): string {
    const baseClass = 'status-badge ';
    switch (status) {
      case 'pending': return baseClass + 'status-pending';
      case 'in_progress': return baseClass + 'status-in_progress';
      case 'waiting_for_parts': return baseClass + 'status-waiting_for_parts';
      case 'completed': return baseClass + 'status-completed';
      default: return baseClass + 'status-pending';
    }
  }

  getPartStatusClass(status: string): string {
    const baseClass = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ';
    switch (status) {
      case 'in_stock': return baseClass + 'bg-green-100 text-green-800';
      case 'ordered': return baseClass + 'bg-yellow-100 text-yellow-800';
      case 'shipped': return baseClass + 'bg-blue-100 text-blue-800';
      case 'delivered': return baseClass + 'bg-purple-100 text-purple-800';
      case 'installed': return baseClass + 'bg-green-100 text-green-800';
      default: return baseClass + 'bg-gray-100 text-gray-800';
    }
  }

  getPartProgressClass(status: string): string {
    switch (status) {
      case 'ordered': return 'bg-yellow-600';
      case 'shipped': return 'bg-blue-600';
      case 'delivered': return 'bg-purple-600';
      case 'installed': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  }

  getPartProgress(status: string): string {
    switch (status) {
      case 'ordered': return '25%';
      case 'shipped': return '50%';
      case 'delivered': return '75%';
      case 'installed': return '100%';
      default: return '0%';
    }
  }

  // Modal methods
  showOrderDetails(order: WorkOrder) {
    this.selectedOrder = order;
    this.showOrderDetailsModal = true;
  }

  hideOrderDetails() {
    this.showOrderDetailsModal = false;
    this.selectedOrder = null;
  }

  showAcceptPopup(order: WorkOrder) {
    this.selectedOrder = order;
    this.showAcceptModal = true;
  }

  hideAcceptPopup() {
    this.showAcceptModal = false;
    this.selectedOrder = null;
  }

  showPartsStatus(order: WorkOrder) {
    this.selectedOrder = order;
    this.showPartsModal = true;
  }

  hidePartsStatus() {
    this.showPartsModal = false;
    this.selectedOrder = null;
  }

  showUpdateForm(order: WorkOrder) {
    this.selectedOrder = { ...order };
    this.showUpdateModal = true;
    this.updateHoursWorked = order['hoursWorked'] || '';
    this.updateSelectedPart = '';
    this.updatePartsUsed = order['partsUsed'] ? [...order['partsUsed']] : [];
    this.updateNotes = order['description'] || '';
    this.updateImages = [];
  }

  hideUpdateModal() {
    this.showUpdateModal = false;
    this.selectedOrder = null;
  }

  addPartUsed() {
    if (this.updateSelectedPart && !this.updatePartsUsed.includes(this.updateSelectedPart)) {
      this.updatePartsUsed.push(this.updateSelectedPart);
      this.updateSelectedPart = '';
    }
  }

  removePartUsed(part: string) {
    this.updatePartsUsed = this.updatePartsUsed.filter(p => p !== part);
  }

  onImageSelected(event: any) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.updateImages.push(files[i]);
    }
  }

  saveOrderUpdate() {
    if (!this.selectedOrder) return;
    const idx = this.workOrders.findIndex(o => o.id === this.selectedOrder!.id);
    if (idx !== -1) {
      this.workOrders[idx] = {
        ...this.selectedOrder,
        hoursWorked: this.updateHoursWorked,
        partsUsed: [...this.updatePartsUsed],
        description: this.updateNotes,
        images: this.updateImages
      };
      this.filterWorkOrders();
      this.updatePaginatedOrders();
    }
    this.hideUpdateModal();
  }

  showInvoice(order: WorkOrder) {
    // Implement invoice display logic
    console.log('Show invoice for order:', order.orderNumber);
  }

  // Action methods
  acceptOrder() {
    if (this.selectedOrder) {
      this.selectedOrder.status = 'in_progress';
      this.selectedOrder.statusHistory.push({
        date: new Date().toISOString().split('T')[0],
        action: 'Order Accepted',
        details: 'Work order accepted by mechanic',
        performedBy: 'Bennet'
      });
      this.filterWorkOrders();
      this.hideAcceptPopup();
    }
  }

  sendCustomerUpdate() {
    if (this.selectedOrder && this.customerNotification) {
      // Implement customer notification logic
      console.log('Sending customer update:', this.customerNotification);
      this.customerNotification = '';
      this.hidePartsStatus();
    }
  }

  printOrder() {
    if (this.selectedOrder) {
      // Implement print logic
      console.log('Printing order:', this.selectedOrder.orderNumber);
      window.print();
    }
  }

  // Logout methods
  confirmLogout() {
    this.showLogoutModal = true;
  }

  hideLogoutPopup() {
    this.showLogoutModal = false;
  }

  performLogout() {
    console.log('Mechanic logout requested');
    this.authService.logout();
    this.hideLogoutPopup();
  }

  isFile(obj: any): boolean {
    return obj instanceof File;
  }
}
