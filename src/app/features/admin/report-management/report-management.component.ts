import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  lastService: string;
  totalVisits: number;
  status: string;
}

interface Mechanic {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  totalJobs: number;
  rating: string;
  status: string;
}

@Component({
  selector: 'app-report-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-management.component.html',
  styleUrl: './report-management.component.css'
})
export class ReportManagementComponent implements OnInit {
  currentReportType: string = 'customers';
  showPreviewModal: boolean = false;
  previewContent: string = '';

  customersData: Customer[] = [
    { id: 'C1001', name: 'Trishala', email: 'trishala@gmail.com', phone: '9945678322', vehicle: 'Toyota Camry 2018', lastService: '2023-05-15', totalVisits: 4, status: 'Active' },
    { id: 'C1002', name: 'Harish', email: 'harish@gmail.com', phone: '8667841876', vehicle: 'Honda Accord 2020', lastService: '2023-06-20', totalVisits: 2, status: 'Active' },
    { id: 'C1003', name: 'Ram', email: 'ram@gmail.com', phone: '7893456356', vehicle: 'Ford F-150 2019', lastService: '2023-04-10', totalVisits: 5, status: 'Inactive' },
    { id: 'C1004', name: 'Alice', email: 'alice@gmail.com', phone: '8769874356', vehicle: 'Chevrolet Malibu 2021', lastService: '2023-07-05', totalVisits: 3, status: 'Active' },
    { id: 'C1005', name: 'Saravanan', email: 'saravanan@gmail.com', phone: '9986543645', vehicle: 'Nissan Rogue 2022', lastService: '2023-03-18', totalVisits: 1, status: 'Inactive' }
  ];

  mechanicsData: Mechanic[] = [
    { id: 'M2001', name: 'Mike Mechanic', email: 'mike@example.com', phone: '555-0201', specialization: 'Engine', totalJobs: 42, rating: '4.8', status: 'Active' },
    { id: 'M2002', name: 'David Technician', email: 'david@example.com', phone: '555-0202', specialization: 'Electrical', totalJobs: 35, rating: '4.6', status: 'Active' },
    { id: 'M2003', name: 'Sarah Engineer', email: 'sarah@example.com', phone: '555-0203', specialization: 'Transmission', totalJobs: 28, rating: '4.9', status: 'Active' },
    { id: 'M2004', name: 'James Specialist', email: 'james@example.com', phone: '555-0204', specialization: 'Brakes', totalJobs: 19, rating: '4.5', status: 'Inactive' }
  ];

  filteredCustomers: Customer[] = [];
  filteredMechanics: Mechanic[] = [];

  // Filter properties
  customerSearch: string = '';
  customerStatusFilter: string = 'all';
  customerVisitsFilter: string = 'all';

  mechanicSearch: string = '';
  mechanicStatusFilter: string = 'all';
  mechanicSpecializationFilter: string = 'all';

  ngOnInit() {
    this.filteredCustomers = [...this.customersData];
    this.filteredMechanics = [...this.mechanicsData];
  }

  showReport(type: string) {
    this.currentReportType = type;
  }

  filterCustomers() {
    this.filteredCustomers = this.customersData.filter(customer => {
      const matchesSearch = 
        customer.id.toLowerCase().includes(this.customerSearch.toLowerCase()) ||
        customer.name.toLowerCase().includes(this.customerSearch.toLowerCase()) ||
        customer.email.toLowerCase().includes(this.customerSearch.toLowerCase()) ||
        customer.phone.includes(this.customerSearch) ||
        customer.vehicle.toLowerCase().includes(this.customerSearch.toLowerCase());
      
      const matchesStatus = this.customerStatusFilter === 'all' || customer.status === this.customerStatusFilter;
      
      let matchesVisits = true;
      if (this.customerVisitsFilter === '1-3') {
        matchesVisits = customer.totalVisits >= 1 && customer.totalVisits <= 3;
      } else if (this.customerVisitsFilter === '4-6') {
        matchesVisits = customer.totalVisits >= 4 && customer.totalVisits <= 6;
      } else if (this.customerVisitsFilter === '7+') {
        matchesVisits = customer.totalVisits >= 7;
      }
      
      return matchesSearch && matchesStatus && matchesVisits;
    });
  }

  filterMechanics() {
    this.filteredMechanics = this.mechanicsData.filter(mechanic => {
      const matchesSearch = 
        mechanic.id.toLowerCase().includes(this.mechanicSearch.toLowerCase()) ||
        mechanic.name.toLowerCase().includes(this.mechanicSearch.toLowerCase()) ||
        mechanic.email.toLowerCase().includes(this.mechanicSearch.toLowerCase()) ||
        mechanic.phone.includes(this.mechanicSearch) ||
        mechanic.specialization.toLowerCase().includes(this.mechanicSearch.toLowerCase());
      
      const matchesStatus = this.mechanicStatusFilter === 'all' || mechanic.status === this.mechanicStatusFilter;
      const matchesSpecialization = this.mechanicSpecializationFilter === 'all' || mechanic.specialization === this.mechanicSpecializationFilter;
      
      return matchesSearch && matchesStatus && matchesSpecialization;
    });
  }

  printReport() {
    this.showPrintPreview();
  }

  showPrintPreview() {
    const currentDate = new Date().toLocaleDateString();
    const title = this.getReportTitle();
    const companyName = "MechniQ Vehicle Service Center"; // You can make this dynamic if needed
    const adminName = "Administrator"; // You can get this from your auth service if needed
    
    // Prepare table data
    let headers: string[];
    let data: any[];
    
    if (this.currentReportType === 'customers') {
      headers = ['ID', 'Name', 'Email', 'Phone', 'Vehicle', 'Last Service', 'Total Visits', 'Status'];
      data = this.filteredCustomers;
    } else {
      headers = ['ID', 'Name', 'Email', 'Phone', 'Specialization', 'Total Jobs', 'Rating', 'Status'];
      data = this.filteredMechanics;
    }

    // Generate preview content
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>${title} - Print Preview</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0;
            padding: 20px;
            background: white;
        }
        .report-header { 
            text-align: center; 
            margin-bottom: 30px;
            padding: 20px;
            border-bottom: 2px solid #1B4B88;
        }
        .company-name {
            color: #1B4B88;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .report-title { 
            color: #1B4B88;
            font-size: 24px;
            margin: 15px 0 10px 0;
        }
        .report-meta {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            color: #666;
            font-size: 14px;
        }
        .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #1B4B88;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        .print-button:hover {
            background: #164080;
        }
        @media print {
            .print-button {
                display: none;
            }
        }
        .summary { 
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .summary h3 { 
            color: #1B4B88;
            margin: 0 0 15px 0;
        }
        .summary-stats {
            display: flex;
            gap: 30px;
            flex-wrap: wrap;
        }
        .stat-item {
            padding: 10px 20px;
            background: white;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        table { 
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        th { 
            background: #1B4B88;
            color: white;
            padding: 12px;
            text-align: left;
        }
        td { 
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
        }
        tr:nth-child(even) {
            background: #f8f9fa;
        }
        .status-active { 
            color: #065f46;
            font-weight: bold;
        }
        .status-inactive { 
            color: #dc2626;
            font-weight: bold;
        }
        .footer { 
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #666;
        }
        .signature-section {
            margin-top: 50px;
            display: flex;
            justify-content: flex-end;
            padding-right: 50px;
        }
        .signature-box {
            text-align: center;
        }
        .signature-line {
            width: 200px;
            border-top: 1px solid #000;
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <button onclick="window.print()" class="print-button">🖨️ Print Report</button>
    
    <div class="report-header">
        <div class="company-name">${companyName}</div>
        <div class="report-title">${title}</div>
        <div class="report-meta">
            <span>Generated by: ${adminName}</span>
            <span>Date: ${currentDate}</span>
        </div>
    </div>
    
    <div class="summary">
        <h3>Summary Statistics</h3>
        <div class="summary-stats">`;
    
    if (this.currentReportType === 'customers') {
      htmlContent += `
            <div class="stat-item">
                <strong>Total Customers:</strong> ${this.getCustomersCount()}
            </div>
            <div class="stat-item">
                <strong>Active Customers:</strong> ${this.getActiveCustomersCount()}
            </div>
            <div class="stat-item">
                <strong>Inactive Customers:</strong> ${this.getInactiveCustomersCount()}
            </div>`;
    } else {
      htmlContent += `
            <div class="stat-item">
                <strong>Total Mechanics:</strong> ${this.getMechanicsCount()}
            </div>
            <div class="stat-item">
                <strong>Active Mechanics:</strong> ${this.getActiveMechanicsCount()}
            </div>
            <div class="stat-item">
                <strong>Inactive Mechanics:</strong> ${this.getInactiveMechanicsCount()}
            </div>`;
    }
    
    htmlContent += `
        </div>
    </div>
    
    <table>
        <thead>
            <tr>`;
    
    headers.forEach(header => {
      htmlContent += `<th>${header}</th>`;
    });
    
    htmlContent += `
            </tr>
        </thead>
        <tbody>`;
    
    data.forEach(row => {
      htmlContent += '<tr>';
      if (this.currentReportType === 'customers') {
        const customer = row as Customer;
        htmlContent += `
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.vehicle}</td>
            <td>${customer.lastService}</td>
            <td>${customer.totalVisits}</td>
            <td class="status-${customer.status.toLowerCase()}">${customer.status}</td>`;
      } else {
        const mechanic = row as Mechanic;
        htmlContent += `
            <td>${mechanic.id}</td>
            <td>${mechanic.name}</td>
            <td>${mechanic.email}</td>
            <td>${mechanic.phone}</td>
            <td>${mechanic.specialization}</td>
            <td>${mechanic.totalJobs}</td>
            <td>${mechanic.rating}</td>
            <td class="status-${mechanic.status.toLowerCase()}">${mechanic.status}</td>`;
      }
      htmlContent += '</tr>';
    });
    
    htmlContent += `
        </tbody>
    </table>
    
    <div class="signature-section">
        <div class="signature-box">
            <div class="signature-line"></div>
            <div>Administrator Signature</div>
        </div>
    </div>

    <div class="footer">
        <p>Generated by MechniQ Vehicle Service Management System</p>
        <p>Report contains ${data.length} records</p>
        <p>This is a system generated report</p>
    </div>
</body>
</html>`;

    // Open the preview in a new window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    }
  }

  closePreviewModal() {
    this.showPreviewModal = false;
  }

  printPreview() {
    window.print();
  }

  exportToExcel() {
    const data = this.currentReportType === 'customers' ? this.filteredCustomers : this.filteredMechanics;
    const headers = this.currentReportType === 'customers' 
      ? ['ID', 'Name', 'Email', 'Phone', 'Vehicle', 'Last Service', 'Total Visits', 'Status']
      : ['ID', 'Name', 'Email', 'Phone', 'Specialization', 'Total Jobs', 'Rating', 'Status'];
    
    // Add summary information at the top
    let csv = `${this.getReportTitle()}\n`;
    csv += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    
    // Add summary statistics
    if (this.currentReportType === 'customers') {
      csv += `Total Customers: ${this.getCustomersCount()}\n`;
      csv += `Active Customers: ${this.getActiveCustomersCount()}\n`;
      csv += `Inactive Customers: ${this.getInactiveCustomersCount()}\n\n`;
    } else {
      csv += `Total Mechanics: ${this.getMechanicsCount()}\n`;
      csv += `Active Mechanics: ${this.getActiveMechanicsCount()}\n`;
      csv += `Inactive Mechanics: ${this.getInactiveMechanicsCount()}\n\n`;
    }
    
    // Add table headers
    csv += headers.join(',') + '\n';
    
    // Add data rows
    data.forEach(row => {
      const values = this.currentReportType === 'customers' 
        ? [row.id, row.name, row.email, row.phone, (row as Customer).vehicle, (row as Customer).lastService, (row as Customer).totalVisits, row.status]
        : [row.id, row.name, row.email, row.phone, (row as Mechanic).specialization, (row as Mechanic).totalJobs, (row as Mechanic).rating, row.status];
      
      // Properly escape values that contain commas or quotes
      const escapedValues = values.map(value => {
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
      
      csv += escapedValues.join(',') + '\n';
    });
    
    // Create and download the file
    try {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${this.currentReportType}_report_${new Date().toISOString().slice(0,10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('CSV report exported successfully!');
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Error downloading CSV file. Please try again.');
    }
  }

  generateCSVContent(): string {
    const currentDate = new Date().toLocaleDateString();
    const title = this.getReportTitle();
    
    let csvContent = `${title}\n`;
    csvContent += `Generated on: ${currentDate}\n\n`;
    
    // Add summary statistics
    if (this.currentReportType === 'customers') {
      csvContent += `Total Customers: ${this.getCustomersCount()}\n`;
      csvContent += `Active Customers: ${this.getActiveCustomersCount()}\n`;
      csvContent += `Inactive Customers: ${this.getInactiveCustomersCount()}\n\n`;
    } else {
      csvContent += `Total Mechanics: ${this.getMechanicsCount()}\n`;
      csvContent += `Active Mechanics: ${this.getActiveMechanicsCount()}\n`;
      csvContent += `Inactive Mechanics: ${this.getInactiveMechanicsCount()}\n\n`;
    }
    
    // Add data
    const data = this.currentReportType === 'customers' ? this.filteredCustomers : this.filteredMechanics;
    const headers = this.currentReportType === 'customers' 
      ? ['ID', 'Name', 'Email', 'Phone', 'Vehicle', 'Last Service', 'Total Visits', 'Status']
      : ['ID', 'Name', 'Email', 'Phone', 'Specialization', 'Total Jobs', 'Rating', 'Status'];

    csvContent += headers.join(',') + '\n';

    data.forEach(row => {
      const values = this.currentReportType === 'customers'
        ? [row.id, row.name, row.email, row.phone, (row as Customer).vehicle, (row as Customer).lastService, (row as Customer).totalVisits, row.status]
        : [row.id, row.name, row.email, row.phone, (row as Mechanic).specialization, (row as Mechanic).totalJobs, (row as Mechanic).rating, row.status];
      
      const escapedValues = values.map(value => {
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
      
      csvContent += escapedValues.join(',') + '\n';
    });
    
    return csvContent;
  }

  getReportTitle(): string {
    return this.currentReportType === 'customers' ? 'Customers Report' : 'Mechanics Report';
  }

  getCustomersCount(): number {
    return this.filteredCustomers.length;
  }

  getMechanicsCount(): number {
    return this.filteredMechanics.length;
  }

  getActiveCustomersCount(): number {
    return this.filteredCustomers.filter(customer => customer.status === 'Active').length;
  }

  getInactiveCustomersCount(): number {
    return this.filteredCustomers.filter(customer => customer.status === 'Inactive').length;
  }

  getActiveMechanicsCount(): number {
    return this.filteredMechanics.filter(mechanic => mechanic.status === 'Active').length;
  }

  getInactiveMechanicsCount(): number {
    return this.filteredMechanics.filter(mechanic => mechanic.status === 'Inactive').length;
  }
}
