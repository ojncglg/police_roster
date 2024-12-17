import { useState, useMemo, useCallback } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: string;
  direction: SortDirection;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

interface UseTableOptions<T> {
  data: T[];
  initialSort?: SortState;
  initialPageSize?: number;
  sortFn?: (a: T, b: T, sort: SortState) => number;
  filterFn?: (item: T, filter: string) => boolean;
}

export function useTable<T extends Record<string, any>>({
  data,
  initialSort,
  initialPageSize = 10,
  sortFn,
  filterFn
}: UseTableOptions<T>) {
  // Sorting state
  const [sort, setSort] = useState<SortState | undefined>(initialSort);

  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: initialPageSize,
    total: data.length
  });

  // Filter state
  const [filter, setFilter] = useState('');

  // Default sort function if none provided
  const defaultSortFn = useCallback((a: T, b: T, sort: SortState) => {
    const aValue = a[sort.field];
    const bValue = b[sort.field];

    if (aValue === bValue) return 0;
    
    const modifier = sort.direction === 'asc' ? 1 : -1;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * modifier;
    }
    
    return ((aValue < bValue ? -1 : 1) * modifier);
  }, []);

  // Default filter function if none provided
  const defaultFilterFn = useCallback((item: T, filter: string) => {
    return Object.values(item).some(value => 
      String(value).toLowerCase().includes(filter.toLowerCase())
    );
  }, []);

  // Process data with sorting and filtering
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply filter
    if (filter) {
      result = result.filter(item => 
        (filterFn || defaultFilterFn)(item, filter)
      );
    }

    // Apply sorting
    if (sort) {
      result.sort((a, b) => 
        (sortFn || defaultSortFn)(a, b, sort)
      );
    }

    // Update total for pagination
    setPagination(prev => ({
      ...prev,
      total: result.length,
      page: Math.min(prev.page, Math.ceil(result.length / prev.pageSize))
    }));

    return result;
  }, [data, sort, filter, sortFn, filterFn, defaultSortFn, defaultFilterFn]);

  // Get current page data
  const pageData = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return processedData.slice(start, end);
  }, [processedData, pagination.page, pagination.pageSize]);

  // Sorting handlers
  const handleSort = useCallback((field: string) => {
    setSort(prev => {
      if (!prev || prev.field !== field) {
        return { field, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        return { field, direction: 'desc' };
      }
      return undefined;
    });
  }, []);

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setPagination(prev => ({
      ...prev,
      pageSize,
      page: 1
    }));
  }, []);

  // Filter handlers
  const handleFilterChange = useCallback((value: string) => {
    setFilter(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  return {
    // Data
    data: pageData,
    processedData,
    
    // Sorting
    sort,
    handleSort,
    
    // Pagination
    pagination,
    handlePageChange,
    handlePageSizeChange,
    
    // Filtering
    filter,
    handleFilterChange,
    
    // Utilities
    totalPages: Math.ceil(pagination.total / pagination.pageSize),
    isEmpty: processedData.length === 0,
    isFiltered: filter !== '',
    
    // Reset functions
    resetSort: () => setSort(initialSort),
    resetPagination: () => setPagination({
      page: 1,
      pageSize: initialPageSize,
      total: data.length
    }),
    resetFilter: () => setFilter(''),
    resetAll: () => {
      setSort(initialSort);
      setPagination({
        page: 1,
        pageSize: initialPageSize,
        total: data.length
      });
      setFilter('');
    }
  };
}

// Example usage:
/*
interface Officer {
  id: string;
  name: string;
  rank: string;
  badgeNumber: string;
}

const {
  data: displayedOfficers,
  sort,
  handleSort,
  pagination,
  handlePageChange,
  handlePageSizeChange,
  filter,
  handleFilterChange,
  totalPages
} = useTable<Officer>({
  data: officers,
  initialSort: { field: 'name', direction: 'asc' },
  initialPageSize: 10,
  filterFn: (officer, filter) => {
    return (
      officer.name.toLowerCase().includes(filter.toLowerCase()) ||
      officer.badgeNumber.includes(filter)
    );
  }
});
*/
