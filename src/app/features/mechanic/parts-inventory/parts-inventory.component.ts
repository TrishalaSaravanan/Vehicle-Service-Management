import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface Part {
  id: string;
  name: string;
  number: string;
  category: string;
  compatibility: string;
  stock: number;
  minStock: number;
  price: number;
  description: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

@Component({
  selector: 'app-parts-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parts-inventory.component.html',
  styleUrls: ['./parts-inventory.component.css']
})
export class PartsInventoryComponent implements OnInit {
  mechanicName = 'Bennet';
  
  // Mobile menu state
  showMobileMenu = false;
  
  // Modal states
  showAddPartModal = false;
  showEditPartModal = false;
  showLogoutPopup = false;
  
  // Filter and search states
  searchTerm = '';
  categoryFilter = 'all';
  statusFilter = 'all';
  sortFilter = 'name-asc';
  
  // Pagination state
  currentPage = 1;
  itemsPerPage = 5;
  
  // Selected part for editing
  selectedPart: Part | null = null;
  
  // Parts data
  partsData: Part[] = [
    {
      id: 'part1',
      name: 'Synthetic Oil 5W-30',
      number: 'OIL-5W30-SYN',
      category: 'Fluids',
      compatibility: '1 Quart',
      stock: 24,
      minStock: 10,
      price: 749,
      description: 'Full synthetic motor oil, 5W-30 viscosity, 1 quart bottle',
      status: 'In Stock'
    },
    {
      id: 'part2',
      name: 'Brake Pads (Front)',
      number: 'BP-TC-2015-F',
      category: 'Brakes',
      compatibility: 'Toyota Camry 2015-2020',
      stock: 2,
      minStock: 5,
      price: 3599,
      description: 'Front brake pads for Toyota Camry 2015-2020',
      status: 'Low Stock'
    },
    {
      id: 'part3',
      name: 'Air Filter',
      number: 'AF-HC-2016',
      category: 'Filters',
      compatibility: 'Honda Civic 2016-2021',
      stock: 0,
      minStock: 3,
      price: 1549,
      description: 'Air filter for Honda Civic 2016-2021',
      status: 'Out of Stock'
    },
    {
      id: 'part4',
      name: 'Spark Plug',
      number: 'SP-FF-2018',
      category: 'Engine',
      compatibility: 'Ford F-150 2018-2022',
      stock: 8,
      minStock: 4,
      price: 1065,
      description: 'Spark plug for Ford F-150 2018-2022',
      status: 'In Stock'
    },
    {
      id: 'part5',
      name: 'Wiper Blades',
      number: 'WB-UNIV-22',
      category: 'Exterior',
      compatibility: 'Universal 22"',
      stock: 3,
      minStock: 5,
      price: 1250,
      description: 'Universal wiper blades 22 inches',
      status: 'Low Stock'
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

  // Filter and search methods
  get filteredParts(): Part[] {
    let filtered = this.partsData;
    
    // Apply search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(part => 
        part.name.toLowerCase().includes(search) ||
        part.number.toLowerCase().includes(search) ||
        part.description.toLowerCase().includes(search)
      );
    }
    
    // Apply category filter
    if (this.categoryFilter !== 'all') {
      filtered = filtered.filter(part => part.category === this.categoryFilter);
    }
    
    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(part => part.status === this.statusFilter);
    }
    
    // Apply sorting
    switch(this.sortFilter) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'stock-high':
        filtered.sort((a, b) => b.stock - a.stock);
        break;
      case 'stock-low':
        filtered.sort((a, b) => a.stock - b.stock);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
    }
    
    return filtered;
  }

  get paginatedParts(): Part[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredParts.slice(startIndex, endIndex);
  }

  // Pagination methods
  getTotalPages(): number {
    return Math.ceil(this.filteredParts.length / this.itemsPerPage);
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    const endIndex = this.currentPage * this.itemsPerPage;
    return Math.min(endIndex, this.filteredParts.length);
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  // Filter change handlers
  onSearchChange(): void {
    this.currentPage = 1;
  }

  onCategoryChange(): void {
    this.currentPage = 1;
  }

  onStatusChange(): void {
    this.currentPage = 1;
  }

  // Modal methods
  showAddModal(): void {
    this.showAddPartModal = true;
  }

  hideAddModal(): void {
    this.showAddPartModal = false;
  }

  showEditModal(part: Part): void {
    this.selectedPart = { ...part };
    this.showEditPartModal = true;
  }

  hideEditModal(): void {
    this.showEditPartModal = false;
    this.selectedPart = null;
  }

  // Part management methods
  addPart(partData: Partial<Part>): void {
    const newPart: Part = {
      id: 'part' + (this.partsData.length + 1),
      name: partData.name || '',
      number: partData.number || '',
      category: partData.category || '',
      compatibility: partData.compatibility || '',
      stock: partData.stock || 0,
      minStock: partData.minStock || 0,
      price: partData.price || 0,
      description: partData.description || '',
      status: this.getPartStatus(partData.stock || 0, partData.minStock || 0)
    };
    
    this.partsData.unshift(newPart);
    this.hideAddModal();
    this.currentPage = 1;
    this.showNotification('Part added successfully!', 'success');
  }

  updatePart(partData: Part): void {
    const index = this.partsData.findIndex(p => p.id === partData.id);
    if (index !== -1) {
      partData.status = this.getPartStatus(partData.stock, partData.minStock);
      this.partsData[index] = { ...partData };
      this.hideEditModal();
      this.showNotification('Part updated successfully!', 'success');
    }
  }

  deletePart(partId: string): void {
    if (confirm('Are you sure you want to delete this part?')) {
      this.partsData = this.partsData.filter(part => part.id !== partId);
      this.showNotification('Part deleted successfully!', 'success');
    }
  }

  // Helper methods
  getPartStatus(stock: number, minStock: number): 'In Stock' | 'Low Stock' | 'Out of Stock' {
    if (stock === 0) {
      return 'Out of Stock';
    } else if (stock <= minStock) {
      return 'Low Stock';
    } else {
      return 'In Stock';
    }
  }

  getPartIcon(category: string): string {
    switch(category) {
      case 'Fluids': return 'fas fa-oil-can';
      case 'Brakes': return 'fas fa-stop-circle';
      case 'Filters': return 'fas fa-filter';
      case 'Engine': return 'fas fa-cog';
      case 'Electrical': return 'fas fa-bolt';
      case 'Exterior': return 'fas fa-car-side';
      case 'Interior': return 'fas fa-chair';
      case 'Suspension': return 'fas fa-car-bump';
      default: return 'fas fa-box';
    }
  }

  getPartIconColor(category: string): string {
    switch(category) {
      case 'Fluids': return 'text-darkblue-600';
      case 'Brakes': return 'text-red-600';
      case 'Filters': return 'text-green-600';
      case 'Engine': return 'text-gray-600';
      case 'Electrical': return 'text-yellow-600';
      case 'Exterior': return 'text-indigo-600';
      case 'Interior': return 'text-purple-600';
      case 'Suspension': return 'text-orange-600';
      default: return 'text-gray-400';
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  // Navigation methods
  navigateToProfile(): void {
    this.router.navigate(['/mechanic/profile']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/mechanic/dashboard']);
  }

  // Logout methods
  confirmLogout(): void {
    this.showLogoutPopup = true;
  }

  hideLogoutPopup(): void {
    this.showLogoutPopup = false;
  }

  performLogout(): void {
    console.log('Mechanic logout requested');
    this.hideLogoutPopup();
    this.authService.logout();
  }

  // Notification method
  showNotification(message: string, type: string): void {
    alert(message);
  }
}
