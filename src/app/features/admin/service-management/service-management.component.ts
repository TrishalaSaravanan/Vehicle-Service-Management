// ...imports and class definition remain unchanged...
import { Component } from '@angular/core';
import { NgIf, NgFor, NgClass, DecimalPipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-service-management',
  standalone: true,
  templateUrl: './service-management.component.html',
  styleUrls: ['./service-management.component.css'],
  imports: [NgIf, NgFor, NgClass, DecimalPipe, CurrencyPipe, FormsModule]
})
export class ServiceManagementComponent {
  // --- Parts Inventory State ---
  showAddPartModal = false;
  showEditPartModal = false;
  newPart: any = {
    name: '',
    number: '',
    category: '',
    compatibility: '',
    stock: 0,
    minStock: 0,
    price: 0,
    description: ''
  };
  editPart: any = null;

  // UI state for filters, search, sort, pagination
  partsSearchTerm = '';
  partsCategoryFilter = 'all';
  partsStatusFilter = 'all';
  partsSortFilter = 'name-asc';
  partsCurrentPage = 1;
  partsPageSize = 5;

  // --- Modal Logic ---
  openAddPartModal() {
    this.newPart = {
      name: '', number: '', category: '', compatibility: '', stock: 0, minStock: 0, price: 0, description: ''
    };
    this.showAddPartModal = true;
  }
  closeAddPartModal() {
    this.showAddPartModal = false;
  }
  saveNewPart() {
    const newId = 'part' + Date.now();
    this.parts.push({ ...this.newPart, id: newId, status: this.getPartStatus(this.newPart) });
    this.closeAddPartModal();
    this.updatePartsPagination();
  }
  openEditPartModal(part: any) {
    this.editPart = { ...part };
    this.showEditPartModal = true;
  }
  closeEditPartModal() {
    this.showEditPartModal = false;
    this.editPart = null;
  }
  saveEditPart() {
    const idx = this.parts.findIndex((p: any) => p.id === this.editPart.id);
    if (idx !== -1) {
      this.parts[idx] = { ...this.editPart, status: this.getPartStatus(this.editPart) };
    }
    this.closeEditPartModal();
    this.updatePartsPagination();
  }
  deletePart(part: any) {
    this.parts = this.parts.filter((p: any) => p.id !== part.id);
    this.updatePartsPagination();
  }

  // --- Data Model ---
  parts = [
    {
      id: 'part1',
      name: 'Oil Filter',
      number: 'OF-1001',
      category: 'Engine',
      compatibility: 'Toyota, Honda',
      stock: 12,
      minStock: 5,
      price: 350,
      description: 'High quality oil filter for most sedans.',
      status: 'In Stock'
    },
    {
      id: 'part2',
      name: 'Brake Pads',
      number: 'BP-2002',
      category: 'Brakes',
      compatibility: 'Ford, Hyundai',
      stock: 3,
      minStock: 5,
      price: 1200,
      description: 'Durable brake pads for safe stopping.',
      status: 'Low Stock'
    },
    {
      id: 'part3',
      name: 'Cabin Air Filter',
      number: 'CAF-3003',
      category: 'Filters',
      compatibility: 'Maruti, Tata',
      stock: 0,
      minStock: 2,
      price: 450,
      description: 'Removes dust and pollen from cabin air.',
      status: 'Out of Stock'
    }
  ];

  // --- Filtering, Sorting, Pagination ---
  get filteredParts() {
    let filtered = this.parts;
    // Search
    if (this.partsSearchTerm.trim()) {
      const term = this.partsSearchTerm.trim().toLowerCase();
      filtered = filtered.filter(part =>
        part.name.toLowerCase().includes(term) ||
        part.number.toLowerCase().includes(term) ||
        part.category.toLowerCase().includes(term) ||
        part.compatibility.toLowerCase().includes(term)
      );
    }
    // Category
    if (this.partsCategoryFilter !== 'all') {
      filtered = filtered.filter(part => part.category === this.partsCategoryFilter);
    }
    // Status
    if (this.partsStatusFilter !== 'all') {
      filtered = filtered.filter(part => part.status === this.partsStatusFilter);
    }
    // Sort
    switch (this.partsSortFilter) {
      case 'name-asc':
        filtered = filtered.slice().sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered = filtered.slice().sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'stock-high':
        filtered = filtered.slice().sort((a, b) => b.stock - a.stock);
        break;
      case 'stock-low':
        filtered = filtered.slice().sort((a, b) => a.stock - b.stock);
        break;
      case 'price-high':
        filtered = filtered.slice().sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        filtered = filtered.slice().sort((a, b) => a.price - b.price);
        break;
    }
    return filtered;
  }

  get paginatedParts() {
    const start = (this.partsCurrentPage - 1) * this.partsPageSize;
    return this.filteredParts.slice(start, start + this.partsPageSize);
  }
  get partsTotalPages() {
    return Math.ceil(this.filteredParts.length / this.partsPageSize);
  }
  get partsPageNumbers() {
    return Array.from({ length: this.partsTotalPages }, (_, i) => i + 1);
  }
  get showingFrom() {
    if (this.filteredParts.length === 0) return 0;
    return (this.partsCurrentPage - 1) * this.partsPageSize + 1;
  }
  get showingTo() {
    return Math.min(this.partsCurrentPage * this.partsPageSize, this.filteredParts.length);
  }
  prevPartsPage() {
    if (this.partsCurrentPage > 1) {
      this.partsCurrentPage--;
    }
  }
  nextPartsPage() {
    if (this.partsCurrentPage < this.partsTotalPages) {
      this.partsCurrentPage++;
    }
  }
  goToPartsPage(page: number) {
    this.partsCurrentPage = page;
  }
  updatePartsPagination() {
    if (this.partsCurrentPage > this.partsTotalPages) {
      this.partsCurrentPage = this.partsTotalPages || 1;
    }
  }

  // --- Status & Icon Logic ---
  getPartStatus(part: any) {
    if (part.stock === 0) return 'Out of Stock';
    if (part.stock <= part.minStock) return 'Low Stock';
    return 'In Stock';
  }
  getStatusClass(status: string): string {
    if (status === 'In Stock') return 'bg-green-100 text-green-800';
    if (status === 'Low Stock') return 'bg-yellow-300 text-gray-900';
    if (status === 'Out of Stock') return 'bg-red-200 text-red-800';
    return 'bg-gray-400 text-white';
  }
  getPartIcon(category: string): string {
    switch (category) {
      case 'Engine': return 'fas fa-cogs';
      case 'Brakes': return 'fas fa-car-crash';
      case 'Suspension': return 'fas fa-car-side';
      case 'Electrical': return 'fas fa-bolt';
      case 'Filters': return 'fas fa-filter';
      case 'Fluids': return 'fas fa-tint';
      case 'Exterior': return 'fas fa-car';
      case 'Interior': return 'fas fa-chair';
      default: return 'fas fa-cube';
    }
  }
  getPartIconColor(category: string): string {
    switch (category) {
      case 'Engine': return 'text-blue-600';
      case 'Brakes': return 'text-red-600';
      case 'Suspension': return 'text-yellow-600';
      case 'Electrical': return 'text-purple-600';
      case 'Filters': return 'text-green-600';
      case 'Fluids': return 'text-cyan-600';
      case 'Exterior': return 'text-gray-700';
      case 'Interior': return 'text-pink-600';
      default: return 'text-gray-400';
    }
  }
  showMessageSent = false;
  sendCustomerMessage() {
    this.showMessageSent = true;
    setTimeout(() => {
      this.showMessageSent = false;
    }, 2000);
  }
  activeTab: 'requests' | 'parts' | 'catalog' = 'requests';
  showAssignModal = false;
  showServiceModal = false;

  // View details modal state
  showViewModal = false;
  viewRequest: any = null;

  openViewModal(req: any) {
    this.viewRequest = req;
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.viewRequest = null;
  }

  // Static data
  requests = [
    { id: 'SR-1001', customer: 'Trishala', vehicle: 'Toyota Camry 2020', service: 'Oil Change', mechanic: '', status: 'Pending' },
    { id: 'SR-1002', customer: 'Saravanan', vehicle: 'Honda Civic 2018', service: 'Brake Inspection', mechanic: 'Kumar', status: 'Assigned' },
    { id: 'SR-1003', customer: 'Pragati', vehicle: 'Ford F-150 2021', service: 'Tire Rotation', mechanic: 'Raj', status: 'Completed' }
  ];
  // (parts array moved above and expanded)
  services = [
    { id: 'svc1', name: 'Oil Change', category: 'Engine', duration: '30 min', price: 49.99, requiredParts: ['Oil Filter', '5W-30 Oil'] },
    { id: 'svc2', name: 'Brake Inspection', category: 'Brakes', duration: '45 min', price: 29.99, requiredParts: ['Brake Fluid'] }
  ];
  mechanics = [
    { id: '1', name: 'Bennet', specialization: 'Engine Specialist' },
    { id: '2', name: 'Kumar', specialization: 'Brake Specialist' },
    { id: '3', name: 'Raj', specialization: 'General' }
  ];

  // Modal state
  assignRequest: any = null;
  assignMechanicId: string = '';
  serviceToEdit: any = null;

  // Tab switching
  setTab(tab: 'requests' | 'parts' | 'catalog') {
    this.activeTab = tab;
  }

  // Assign Mechanic Modal
  openAssignModal(request: any) {
    this.assignRequest = request;
    this.assignMechanicId = '';
    this.showAssignModal = true;
  }
  closeAssignModal() {
    this.showAssignModal = false;
    this.assignRequest = null;
    this.assignMechanicId = '';
  }

  // Assign mechanic to request
  assignMechanic() {
    if (this.assignRequest && this.assignMechanicId) {
      const mechanic = this.mechanics.find(m => m.id === this.assignMechanicId);
      if (mechanic) {
        const reqIdx = this.requests.findIndex(r => r.id === this.assignRequest.id);
        if (reqIdx > -1) {
          this.requests[reqIdx] = {
            ...this.requests[reqIdx],
            mechanic: mechanic.name,
            status: 'Assigned'
          };
        }
      }
      this.closeAssignModal();
    }
  }

  // Complete assigned request
  completeRequest(req: any) {
    const reqIdx = this.requests.findIndex(r => r.id === req.id);
    if (reqIdx > -1) {
      this.requests[reqIdx] = {
        ...this.requests[reqIdx],
        status: 'Completed'
      };
    }
  }

  // Message state for view modal
  showMessageBox = false;
  messageText = '';
  messageSent = false;

  openMessageBox() {
    this.showMessageBox = true;
    this.messageText = '';
    this.messageSent = false;
  }

  closeMessageBox() {
    this.showMessageBox = false;
    this.messageText = '';
    this.messageSent = false;
  }

  sendMessage() {
    if (this.messageText.trim()) {
      this.messageSent = true;
      // Simulate sending message (could be replaced with real logic)
      setTimeout(() => {
        this.closeMessageBox();
        alert('Message sent to customer!');
      }, 800);
    }
  }

  // Services CRUD
  openServiceModal(service: any = null) {
    this.serviceToEdit = service ? { ...service, requiredPartsStr: service.requiredParts?.join(', ') } : { name: '', category: '', duration: '', price: 0, requiredParts: [], requiredPartsStr: '' };
    this.showServiceModal = true;
  }
  closeServiceModal() {
    this.showServiceModal = false;
    this.serviceToEdit = null;
  }
  saveService() {
    this.serviceToEdit.requiredParts = (this.serviceToEdit.requiredPartsStr || '').split(',').map((s: string) => s.trim()).filter((s: string) => s);
    delete this.serviceToEdit.requiredPartsStr;
    if (this.serviceToEdit.id) {
      const idx = this.services.findIndex(svc => svc.id === this.serviceToEdit.id);
      if (idx !== -1) this.services[idx] = { ...this.serviceToEdit };
    } else {
      this.serviceToEdit.id = 'svc' + (Date.now());
      this.services.push({ ...this.serviceToEdit });
    }
    this.closeServiceModal();
  }
  deleteService(id: string) {
    this.services = this.services.filter(svc => svc.id !== id);
  }

  // Utility
  // (removed duplicate getStatusClass for requests, now only the new one for parts remains)
}
