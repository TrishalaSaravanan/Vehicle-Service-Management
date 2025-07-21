import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface ServiceItem {
  name: string;
  description: string;
  quantity: string;
  price: string;
  total: string;
}

interface Attachment {
  name: string;
  type: string;
  size: string;
}

interface Customer {
  name: string;
  phone: string;
  email: string;
  address: string;
}

interface Vehicle {
  make: string;
  model: string;
  year: string;
  vin: string;
  mileage: string;
}

interface Service {
  id: string;
  customer: Customer;
  vehicle: Vehicle;
  serviceType: string;
  date: string;
  actualDate: Date;
  amount: string;
  status: string;
  completionStatus: string;
  items: ServiceItem[];
  notes: string;
  attachments: Attachment[];
}

@Component({
  selector: 'app-service-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './service-history.component.html',
  styleUrls: ['./service-history.component.css']
})
export class ServiceHistoryComponent implements OnInit {
  mechanicName = 'Bennet';
  
  // Filter states
  searchTerm = '';
  timePeriodFilter = 'all';
  serviceTypeFilter = 'all';
  statusFilter = 'all';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  
  // Modal states
  showServiceDetails = false;
  selectedService: Service | null = null;
  showMobileMenu = false;
  showNotifications = false;
  notificationCount = 2;
  
  // Sample notifications
  notifications = [
    {
      id: '1',
      title: 'New appointment scheduled',
      description: 'Today at 2:30 PM - Oil change for Priya\'s Honda City',
      icon: 'fas fa-calendar-check',
      iconBg: 'bg-blue-100 text-blue-600',
      timestamp: 'Just now'
    },
    {
      id: '2',
      title: 'Payment received',
      description: '₹5,500 for SV-2023-0140 (Tire Rotation)',
      icon: 'fas fa-rupee-sign',
      iconBg: 'bg-green-100 text-green-600',
      timestamp: '1 hour ago'
    },
    {
      id: '3',
      title: 'Part low in stock',
      description: 'Only 2 units of Bosch Oil Filter left',
      icon: 'fas fa-exclamation-circle',
      iconBg: 'bg-yellow-100 text-yellow-600',
      timestamp: '3 hours ago'
    }
  ];

  services: Service[] = [
    {
      id: 'SV-2023-0142',
      customer: { name: 'Trishala', phone: '9345260068', email: 'trishala@example.com', address: '123 Main St, Anytown' },
      vehicle: { make: 'Toyota', model: 'Camry', year: '2020', vin: 'JT2BF22K3W0123456', mileage: '42,350 km' },
      serviceType: 'Brake System Repair',
      date: '15 Oct 2023',
      actualDate: new Date(2023, 9, 15),
      amount: '₹8,750',
      status: 'Paid',
      completionStatus: 'Completed',
      items: [
        { name: 'Brake Pads Replacement', description: 'Front brake pads', quantity: '1 set', price: '₹3,599', total: '₹3,599' },
        { name: 'Brake Fluid Change', description: 'DOT 4 Brake Fluid', quantity: '1', price: '₹1,200', total: '₹1,200' },
        { name: 'Labor', description: 'Brake system service', quantity: '2.5 hrs', price: '₹1,200/hr', total: '₹3,000' },
        { name: 'Miscellaneous', description: 'Cleaning supplies, etc.', quantity: '1', price: '₹951', total: '₹951' }
      ],
      notes: 'Customer reported squeaking noise when braking. Found worn brake pads and contaminated brake fluid. Replaced front brake pads and flushed brake fluid system. Test drive confirmed issue resolved.',
      attachments: [
        { name: 'Service_Report_SV-2023-0142.pdf', type: 'pdf', size: '245 KB' },
        { name: 'Brake_Pads_Photo.jpg', type: 'image', size: '1.2 MB' }
      ]
    },
    {
      id: 'SV-2023-0141',
      customer: { name: 'Sarah', phone: '9875555678', email: 'sarah@example.com', address: '456 Oak Ave, Somewhere' },
      vehicle: { make: 'Honda', model: 'Civic', year: '2019', vin: '2HGFC2F56KH123456', mileage: '38,750 km' },
      serviceType: 'Oil Change',
      date: '14 Oct 2023',
      actualDate: new Date(2023, 9, 14),
      amount: '₹3,250',
      status: 'Paid',
      completionStatus: 'Completed',
      items: [
        { name: 'Synthetic Oil Change', description: '5W-30 Synthetic Oil', quantity: '5L', price: '₹2,000', total: '₹2,000' },
        { name: 'Oil Filter', description: 'Premium Oil Filter', quantity: '1', price: '₹750', total: '₹750' },
        { name: 'Labor', description: 'Oil change service', quantity: '0.5 hrs', price: '₹1,000/hr', total: '₹500' }
      ],
      notes: 'Regular oil change service. No issues found during inspection.',
      attachments: [
        { name: 'Service_Report_SV-2023-0141.pdf', type: 'pdf', size: '210 KB' }
      ]
    },
    {
      id: 'SV-2023-0140',
      customer: { name: 'Kumar', phone: '8765559012', email: 'kumar@example.com', address: '789 Pine Rd, Nowhere' },
      vehicle: { make: 'Ford', model: 'F-150', year: '2021', vin: '1FTFW1E5XMK123456', mileage: '25,300 km' },
      serviceType: 'Tire Service',
      date: '12 Oct 2023',
      actualDate: new Date(2023, 9, 12),
      amount: '₹5,500',
      status: 'Pending Payment',
      completionStatus: 'Completed',
      items: [
        { name: 'Tire Rotation', description: '4 tires', quantity: '1', price: '₹1,500', total: '₹1,500' },
        { name: 'Wheel Alignment', description: '4-wheel alignment', quantity: '1', price: '₹3,000', total: '₹3,000' },
        { name: 'Tire Balancing', description: 'All wheels', quantity: '4', price: '₹250/wheel', total: '₹1,000' }
      ],
      notes: 'Customer reported uneven tire wear. Performed alignment and found front wheels out of spec. Adjusted to manufacturer specifications.',
      attachments: [
        { name: 'Service_Report_SV-2023-0140.pdf', type: 'pdf', size: '230 KB' },
        { name: 'Alignment_Report.pdf', type: 'pdf', size: '180 KB' }
      ]
    },
    {
      id: 'SV-2023-0139',
      customer: { name: 'Dhyan', phone: '8746597365', email: 'dhyan@example.com', address: '321 Elm St, Anywhere' },
      vehicle: { make: 'Hyundai', model: 'Creta', year: '2022', vin: 'MALBB51BLKM123456', mileage: '15,800 km' },
      serviceType: 'Engine Repair',
      date: '10 Oct 2023',
      actualDate: new Date(2023, 9, 10),
      amount: '₹12,300',
      status: 'Paid',
      completionStatus: 'Completed',
      items: [
        { name: 'Engine Diagnostics', description: 'Full system scan', quantity: '1', price: '₹2,500', total: '₹2,500' },
        { name: 'Spark Plugs Replacement', description: 'Iridium spark plugs', quantity: '4', price: '₹1,200/plug', total: '₹4,800' },
        { name: 'Labor', description: 'Diagnostics and repair', quantity: '3 hrs', price: '₹1,500/hr', total: '₹4,500' },
        { name: 'Miscellaneous', description: 'Gaskets, cleaning', quantity: '1', price: '₹500', total: '₹500' }
      ],
      notes: 'Check engine light on. Diagnostics revealed misfire in cylinder 3. Replaced all spark plugs as preventive maintenance.',
      attachments: [
        { name: 'Service_Report_SV-2023-0139.pdf', type: 'pdf', size: '275 KB' },
        { name: 'Diagnostic_Report.pdf', type: 'pdf', size: '320 KB' }
      ]
    },
    {
      id: 'SV-2023-0138',
      customer: { name: 'ganesh', phone: '7685557890', email: 'ganesh@example.com', address: '654 Maple Dr, Everywhere' },
      vehicle: { make: 'Maruti', model: 'Swift', year: '2020', vin: 'MA3EWBHL2LM123456', mileage: '32,450 km' },
      serviceType: 'AC Service',
      date: '8 Oct 2023',
      actualDate: new Date(2023, 9, 8),
      amount: '₹4,800',
      status: 'Paid',
      completionStatus: 'Completed',
      items: [
        { name: 'AC Gas Recharge', description: 'R134a refrigerant', quantity: '1', price: '₹2,500', total: '₹2,500' },
        { name: 'AC Filter Replacement', description: 'Cabin air filter', quantity: '1', price: '₹800', total: '₹800' },
        { name: 'Labor', description: 'AC system service', quantity: '1 hr', price: '₹1,500/hr', total: '₹1,500' }
      ],
      notes: 'Customer reported weak cooling. Found refrigerant level low. Recharged system and replaced cabin filter. System now cooling properly.',
      attachments: [
        { name: 'Service_Report_SV-2023-0138.pdf', type: 'pdf', size: '240 KB' }
      ]
    },
    {
      id: 'SV-2023-0137',
      customer: { name: 'Priya', phone: '7345552345', email: 'priya@example.com', address: '987 Cedar Ln, Somewhere' },
      vehicle: { make: 'Tata', model: 'Nexon', year: '2021', vin: 'MAT621200LM123456', mileage: '28,900 km' },
      serviceType: 'Battery Replacement',
      date: '5 Oct 2023',
      actualDate: new Date(2023, 9, 5),
      amount: '₹6,200',
      status: 'Paid',
      completionStatus: 'Completed',
      items: [
        { name: 'Battery Replacement', description: 'Exide 45Ah battery', quantity: '1', price: '₹5,000', total: '₹5,000' },
        { name: 'Labor', description: 'Battery installation', quantity: '0.5 hrs', price: '₹1,200/hr', total: '₹600' },
        { name: 'Battery Disposal', description: 'Old battery recycling', quantity: '1', price: '₹600', total: '₹600' }
      ],
      notes: 'Customer reported slow engine crank. Battery test showed weak cells. Replaced with new battery and tested charging system - all normal.',
      attachments: [
        { name: 'Service_Report_SV-2023-0137.pdf', type: 'pdf', size: '220 KB' },
        { name: 'Battery_Test.pdf', type: 'pdf', size: '150 KB' }
      ]
    },
    {
      id: 'SV-2023-0136',
      customer: { name: 'Balaji', phone: '9080721935', email: 'balaji@example.com', address: '159 Birch St, Anywhere' },
      vehicle: { make: 'Kia', model: 'Seltos', year: '2022', vin: 'KIALB51CLKM123456', mileage: '12,300 km' },
      serviceType: 'Electrical',
      date: '3 Oct 2023',
      actualDate: new Date(2023, 9, 3),
      amount: '₹3,700',
      status: 'Pending Payment',
      completionStatus: 'Completed',
      items: [
        { name: 'Headlight Bulb Replacement', description: 'LED bulb', quantity: '2', price: '₹1,200/bulb', total: '₹2,400' },
        { name: 'Labor', description: 'Bulb replacement', quantity: '0.5 hrs', price: '₹1,200/hr', total: '₹600' },
        { name: 'Electrical Diagnostics', description: 'Lighting system check', quantity: '1', price: '₹700', total: '₹700' }
      ],
      notes: 'Customer reported left headlight not working. Found both bulbs nearing end of life. Replaced both as preventive maintenance.',
      attachments: [
        { name: 'Service_Report_SV-2023-0136.pdf', type: 'pdf', size: '210 KB' }
      ]
    },
    {
      id: 'SV-2023-0135',
      customer: { name: 'Sakthi', phone: '6783544567', email: 'sakthi@example.com', address: '753 Walnut Ave, Nowhere' },
      vehicle: { make: 'Hyundai', model: 'i20', year: '2020', vin: 'MALBB51BLKM654321', mileage: '35,200 km' },
      serviceType: 'Oil Change',
      date: '1 Oct 2023',
      actualDate: new Date(2023, 9, 1),
      amount: '₹3,500',
      status: 'Paid',
      completionStatus: 'Completed',
      items: [
        { name: 'Synthetic Oil Change', description: '5W-30 Synthetic Oil', quantity: '4L', price: '₹2,200', total: '₹2,200' },
        { name: 'Oil Filter', description: 'Premium Oil Filter', quantity: '1', price: '₹800', total: '₹800' },
        { name: 'Labor', description: 'Oil change service', quantity: '0.5 hrs', price: '₹1,000/hr', total: '₹500' }
      ],
      notes: 'Regular oil change service. Also performed multipoint inspection - no issues found.',
      attachments: [
        { name: 'Service_Report_SV-2023-0135.pdf', type: 'pdf', size: '205 KB' },
        { name: 'Inspection_Checklist.pdf', type: 'pdf', size: '180 KB' }
      ]
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Initialize component
  }

  // Mobile menu methods
  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  // Notification methods
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  // Filter methods
  get filteredServices(): Service[] {
    let filtered = [...this.services];
    
    // Filter by search term
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(service => 
        service.id.toLowerCase().includes(searchLower) ||
        service.customer.name.toLowerCase().includes(searchLower) ||
        service.vehicle.make.toLowerCase().includes(searchLower) ||
        service.vehicle.model.toLowerCase().includes(searchLower) ||
        service.serviceType.toLowerCase().includes(searchLower)
      );
    }

    // Filter by time period
    if (this.timePeriodFilter !== 'all') {
      const days = parseInt(this.timePeriodFilter);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      filtered = filtered.filter(service => 
        service.actualDate >= cutoffDate
      );
    }

    // Filter by service type
    if (this.serviceTypeFilter !== 'all') {
      filtered = filtered.filter(service => 
        service.serviceType === this.serviceTypeFilter
      );
    }

    // Filter by status
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(service => 
        service.status === this.statusFilter
      );
    }

    return filtered;
  }

  // Pagination methods
  get paginatedServices(): Service[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredServices.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredServices.length / this.itemsPerPage);
  }

  get startItem(): number {
    return this.filteredServices.length > 0 ? (this.currentPage - 1) * this.itemsPerPage + 1 : 0;
  }

  get endItem(): number {
    const endIndex = this.currentPage * this.itemsPerPage;
    return Math.min(endIndex, this.filteredServices.length);
  }

  get totalItems(): number {
    return this.filteredServices.length;
  }

  get pageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  goToPrevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Filter methods
  applyFilters(): void {
    this.currentPage = 1; // Reset to first page when filters change
  }

  // Service detail methods
  showServiceDetailsModal(service: Service): void {
    this.selectedService = service;
    this.showServiceDetails = true;
  }

  hideServiceDetailsModal(): void {
    this.showServiceDetails = false;
    this.selectedService = null;
  }

  // Utility methods
  getStatusClass(status: string): string {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending Payment':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getAttachmentIcon(type: string): string {
    switch (type) {
      case 'pdf':
        return 'fas fa-file-pdf text-blue-600';
      case 'image':
        return 'fas fa-image text-green-600';
      default:
        return 'fas fa-file text-gray-600';
    }
  }

  getAttachmentIconBg(type: string): string {
    switch (type) {
      case 'pdf':
        return 'bg-blue-100';
      case 'image':
        return 'bg-green-100';
      default:
        return 'bg-gray-100';
    }
  }

  // Action methods
  printInvoice(serviceId: string): void {
    if (serviceId === 'current' && this.selectedService) {
      alert('Printing invoice for service: ' + this.selectedService.id);
    } else {
      const service = this.services.find(s => s.id === serviceId);
      if (service) {
        alert(`Printing invoice for service: ${serviceId}\nCustomer: ${service.customer.name}\nAmount: ${service.amount}`);
      }
    }
  }

  sendInvoice(serviceId: string): void {
    if (serviceId === 'current' && this.selectedService) {
      alert('Sending invoice for service: ' + this.selectedService.id + ' to customer email');
    } else {
      const service = this.services.find(s => s.id === serviceId);
      if (service) {
        alert(`Sending invoice for service: ${serviceId} to ${service.customer.email}`);
      }
    }
  }

  // Navigation methods
  navigateToProfile(): void {
    this.router.navigate(['/mechanic/profile']);
  }

  // Logout methods
  confirmLogout(): void {
    if (confirm('Are you sure you want to logout?')) {
      console.log('Mechanic logout requested');
      this.authService.logout();
    }
  }
}
