import Papa from 'papaparse';
import { z } from 'zod';
import { Client, ImportClient, ImportClientSchema } from './schema';

// CSV export configuration
export const CSV_EXPORT_CONFIG = {
  headers: [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'brand', label: 'Brand' },
    { key: 'status', label: 'Status' },
    { key: 'lastBookingDate', label: 'Last Booking Date' },
    { key: 'registrationDate', label: 'Registration Date' },
    { key: 'notes', label: 'Notes' },
  ],
  filename: `clients_${new Date().toISOString().slice(0, 16).replace('T', '_')}.csv`,
};

// Export clients to CSV
export const exportClientsToCSV = (clients: Client[]): string => {
  const data = clients.map(client => ({
    name: client.name,
    email: client.email,
    phone: client.phone || '',
    brand: client.brand,
    status: client.status,
    lastBookingDate: client.lastBookingDate?.toLocaleDateString() || '',
    registrationDate: client.registrationDate.toLocaleDateString(),
    notes: client.notes || '',
  }));

  return Papa.unparse({
    fields: CSV_EXPORT_CONFIG.headers.map(h => h.label),
    data,
  });
};

// Parse CSV file
export const parseCSVFile = (file: File): Promise<{ data: any[]; errors: Papa.ParseError[] }> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => {
        // Normalize header names to match our schema
        const normalized = header.toLowerCase().trim();
        switch (normalized) {
          case 'name': return 'name';
          case 'email': return 'email';
          case 'phone': return 'phone';
          case 'brand': return 'brand';
          case 'status': return 'status';
          case 'last booking date':
          case 'lastbookingdate':
          case 'last_booking_date': return 'lastBookingDate';
          case 'registration date':
          case 'registrationdate':
          case 'registration_date': return 'registrationDate';
          case 'notes': return 'notes';
          default: return header;
        }
      },
      complete: (results) => {
        resolve({
          data: results.data,
          errors: results.errors,
        });
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

// Validate parsed CSV data
export const validateImportData = (data: any[]): {
  validRows: ImportClient[];
  errors: { row: number; field: string; message: string }[];
} => {
  const validRows: ImportClient[] = [];
  const errors: { row: number; field: string; message: string }[] = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2; // +2 because of 0-indexing and header row

    try {
      const validatedRow = ImportClientSchema.parse(row);
      validRows.push(validatedRow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((err) => {
          errors.push({
            row: rowNumber,
            field: err.path.join('.'),
            message: err.message,
          });
        });
      } else {
        errors.push({
          row: rowNumber,
          field: 'unknown',
          message: 'Unknown validation error',
        });
      }
    }
  });

  return { validRows, errors };
};

// Download CSV file
export const downloadCSV = (csvContent: string, filename: string = CSV_EXPORT_CONFIG.filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
