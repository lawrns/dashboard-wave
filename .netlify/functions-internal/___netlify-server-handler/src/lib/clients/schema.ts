import { z } from 'zod';

// Client schema for the main table
export const ClientSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  lastBookingDate: z.date().optional(),
  brand: z.enum(['Heiwa House', 'Freedom Routes']),
  status: z.enum(['Active', 'Inactive']),
  registrationDate: z.date(),
  notes: z.string().optional(),
});

export type Client = z.infer<typeof ClientSchema>;

// Schema for CSV import (more lenient)
export const ImportClientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  lastBookingDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  brand: z.enum(['Heiwa House', 'Freedom Routes']).optional().default('Heiwa House'),
  status: z.enum(['Active', 'Inactive']).optional().default('Active'),
  registrationDate: z.string().optional().transform(val => val ? new Date(val) : new Date()),
  notes: z.string().optional(),
}).transform(data => ({
  ...data,
  lastBookingDate: data.lastBookingDate || undefined,
}));

export type ImportClient = z.infer<typeof ImportClientSchema>;

// Form schema for add/edit dialog
export const ClientFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  brand: z.enum(['Heiwa House', 'Freedom Routes']),
  status: z.enum(['Active', 'Inactive']),
  lastBookingDate: z.date().optional(),
  notes: z.string().optional(),
});

export type ClientFormData = z.infer<typeof ClientFormSchema>;

// Table column visibility schema
export const ColumnVisibilitySchema = z.record(z.string(), z.boolean());

export type ColumnVisibility = z.infer<typeof ColumnVisibilitySchema>;

// Filter schemas
export const BrandFilterSchema = z.enum(['All', 'Heiwa House', 'Freedom Routes']);
export const StatusFilterSchema = z.enum(['All', 'Active', 'Inactive']);

export type BrandFilter = z.infer<typeof BrandFilterSchema>;
export type StatusFilter = z.infer<typeof StatusFilterSchema>;

// URL state schema for persistence
export const ClientsUrlStateSchema = z.object({
  q: z.string().optional(),
  brand: BrandFilterSchema.optional(),
  status: StatusFilterSchema.optional(),
  page: z.coerce.number().min(1).optional(),
  pageSize: z.coerce.number().min(1).optional(),
  sort: z.string().optional(),
  columns: ColumnVisibilitySchema.optional(),
});

export type ClientsUrlState = z.infer<typeof ClientsUrlStateSchema>;
