import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Download, Upload, Settings, Filter, ArrowUpDown, Eye, EyeOff } from 'lucide-react';
import { BrandFilter, StatusFilter, ColumnVisibility } from '@/lib/clients/schema';
import { motion } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';

interface ClientsToolbarProps {
  count: number;
  searchQuery: string;
  brandFilter: BrandFilter;
  statusFilter: StatusFilter;
  columnVisibility: ColumnVisibility;
  sortBy?: string;
  onSearchChange: (query: string) => void;
  onBrandChange: (brand: BrandFilter) => void;
  onStatusChange: (status: StatusFilter) => void;
  onColumnVisibilityChange: (visibility: ColumnVisibility) => void;
  onSortChange: (sortBy: string) => void;
  onAdd: () => void;
  onImport: () => void;
  onExport: () => void;
}

const BRAND_OPTIONS: { value: BrandFilter; label: string }[] = [
  { value: 'All', label: 'All Brands' },
  { value: 'Heiwa House', label: 'Heiwa House' },
  { value: 'Freedom Routes', label: 'Freedom Routes' },
];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'All', label: 'All Status' },
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
];

const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'email-asc', label: 'Email (A-Z)' },
  { value: 'email-desc', label: 'Email (Z-A)' },
  { value: 'registrationDate-desc', label: 'Newest First' },
  { value: 'registrationDate-asc', label: 'Oldest First' },
  { value: 'lastBookingDate-desc', label: 'Recent Activity' },
];

const COLUMN_OPTIONS = [
  { key: 'phone', label: 'Phone' },
  { key: 'lastBookingDate', label: 'Last Booking' },
  { key: 'registrationDate', label: 'Registration Date' },
];

export const ClientsToolbar: React.FC<ClientsToolbarProps> = ({
  count,
  searchQuery,
  brandFilter,
  statusFilter,
  columnVisibility,
  sortBy,
  onSearchChange,
  onBrandChange,
  onStatusChange,
  onColumnVisibilityChange,
  onSortChange,
  onAdd,
  onImport,
  onExport,
}) => {
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Debounce search input
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  const handleColumnToggle = (columnKey: string) => {
    onColumnVisibilityChange({
      ...columnVisibility,
      [columnKey]: !columnVisibility[columnKey],
    });
  };

  const hasActiveFilters = brandFilter !== 'All' || statusFilter !== 'All' || searchQuery.trim() !== '';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="admin-clients-toolbar"
    >
      {/* Desktop Layout */}
      <div className="hidden md:flex admin-clients-toolbar-section">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search clients…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 admin-clients-focus-ring"
            aria-label="Search clients"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Select value={brandFilter} onValueChange={onBrandChange}>
            <SelectTrigger className="w-40" aria-label="Filter by brand">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BRAND_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-32" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy || 'name-asc'} onValueChange={onSortChange}>
            <SelectTrigger className="w-40" aria-label="Sort clients">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" aria-label="Column visibility">
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2 py-1.5 text-sm font-medium text-gray-700">
                Show Columns
              </div>
              <DropdownMenuSeparator />
              {COLUMN_OPTIONS.map(column => (
                <DropdownMenuItem
                  key={column.key}
                  onClick={() => handleColumnToggle(column.key)}
                  className="flex items-center gap-2"
                >
                  {columnVisibility[column.key] ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                  {column.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            onClick={onImport}
            className="flex items-center gap-2"
            aria-label="Import CSV"
          >
            <Upload className="w-4 h-4" />
            Import
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="flex items-center gap-2"
            aria-label="Export CSV"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>

          <Button
            onClick={onAdd}
            className="flex items-center gap-2"
            aria-label="Add new client"
          >
            <Plus className="w-4 h-4" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-4">
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search clients…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
              aria-label="Search clients"
            />
          </div>

          {/* Mobile Filters Toggle */}
          <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" aria-label="Open filters">
                <Filter className="w-4 h-4" />
                {hasActiveFilters && <Badge className="ml-1 h-2 w-2 p-0 bg-blue-600" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Filters & Settings</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                {/* Filters */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Brand
                    </label>
                    <Select value={brandFilter} onValueChange={onBrandChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BRAND_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Status
                    </label>
                    <Select value={statusFilter} onValueChange={onStatusChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Sort By
                    </label>
                    <Select value={sortBy || 'name-asc'} onValueChange={onSortChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SORT_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Column Visibility */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Show Columns
                  </label>
                  <div className="space-y-2">
                    {COLUMN_OPTIONS.map(column => (
                      <div
                        key={column.key}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">{column.label}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleColumnToggle(column.key)}
                          className="h-8 w-8 p-0"
                        >
                          {columnVisibility[column.key] ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onImport}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>

          <Button onClick={onAdd} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {brandFilter !== 'All' && (
            <Badge variant="secondary" className="text-xs">
              Brand: {brandFilter}
            </Badge>
          )}
          {statusFilter !== 'All' && (
            <Badge variant="secondary" className="text-xs">
              Status: {statusFilter}
            </Badge>
          )}
          {searchQuery.trim() && (
            <Badge variant="secondary" className="text-xs">
              Search: "{searchQuery}"
            </Badge>
          )}
        </div>
      )}
    </motion.div>
  );
};
