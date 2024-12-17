import { useCallback, useMemo, useState } from 'react'

export type SortDirection = 'asc' | 'desc'

export interface SortState {
  field: string
  direction: SortDirection
}

export interface PaginationState {
  page: number
  pageSize: number
  total: number
}

interface UseTableOptions<T> {
  data: T[]
  initialSort?: SortState
  initialPageSize?: number
  sortFn?: (a: T, b: T, sort: SortState) => number
  filterFn?: (item: T, filter: string) => boolean
}

export type SortableValue = string | number | boolean | Date | null | undefined

const isDate = (value: unknown): value is Date => value instanceof Date

export type ObjectWithKeys<T> = {
  [K in keyof T]: T[K]
} & {
  [key: string]: SortableValue
}

export function useTable<T extends ObjectWithKeys<T>>({
  data,
  initialSort,
  initialPageSize = 10,
  sortFn,
  filterFn,
}: UseTableOptions<T>) {
  // Sorting state
  const [sort, setSort] = useState<SortState | undefined>(initialSort)

  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: initialPageSize,
    total: data.length,
  })

  // Filter state
  const [filter, setFilter] = useState('')

  // Default sort function if none provided
  const defaultSortFn = useCallback((a: T, b: T, sort: SortState) => {
    const aValue: SortableValue = a[sort.field as keyof T]
    const bValue: SortableValue = b[sort.field as keyof T]

    if (aValue === bValue) return 0
    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1

    const modifier = sort.direction === 'asc' ? 1 : -1

    // Handle dates first since instanceof doesn't work with typeof
    if (isDate(aValue) && isDate(bValue)) {
      return (aValue.getTime() - bValue.getTime()) * modifier
    }

    // Check other types
    if (typeof aValue === typeof bValue) {
      if (typeof aValue === 'string') {
        return (aValue as string).localeCompare(bValue as string) * modifier
      }

      if (typeof aValue === 'number') {
        return ((aValue as number) - (bValue as number)) * modifier
      }

      if (typeof aValue === 'boolean') {
        return ((aValue === bValue ? 0 : aValue ? 1 : -1)) * modifier
      }
    }

    // Fallback to string comparison
    return String(aValue).localeCompare(String(bValue)) * modifier
  }, [])

  // Default filter function if none provided
  const defaultFilterFn = useCallback((item: T, filter: string) => {
    const searchTerm = filter.toLowerCase()
    const itemValues = Object.values(item)
    return itemValues.some(value => {
      if (value === null || value === undefined) return false
      if (Array.isArray(value)) {
        return value.some(v => String(v).toLowerCase().includes(searchTerm))
      }
      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchTerm)
      }
      if (value instanceof Date) {
        return value.toISOString().toLowerCase().includes(searchTerm)
      }
      return String(value).toLowerCase().includes(searchTerm)
    })
  }, [])

  // Process data with sorting and filtering
  const processedData = useMemo(() => {
    let result = [...data]

    // Apply filter
    if (filter) {
      result = result.filter(item => (filterFn || defaultFilterFn)(item, filter))
    }

    // Apply sorting
    if (sort) {
      result.sort((a, b) => (sortFn || defaultSortFn)(a, b, sort))
    }

    // Update total and adjust page if needed
    const total = result.length
    const maxPage = Math.ceil(total / pagination.pageSize)
    if (pagination.page > maxPage) {
      setPagination(prev => ({
        ...prev,
        total,
        page: Math.max(1, maxPage),
      }))
    } else {
      setPagination(prev => ({
        ...prev,
        total,
      }))
    }

    return result
  }, [data, sort, filter, sortFn, filterFn, defaultSortFn, defaultFilterFn, pagination.pageSize, pagination.page])

  // Get current page data
  const pageData = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    return processedData.slice(start, end)
  }, [processedData, pagination.page, pagination.pageSize])

  // Sorting handlers
  const handleSort = useCallback((field: keyof T) => {
    setSort(prev => {
      if (!prev || prev.field !== field) {
        return { field: String(field), direction: 'asc' }
      }
      if (prev.direction === 'asc') {
        return { field: String(field), direction: 'desc' }
      }
      return undefined
    })
  }, [])

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }, [])

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setPagination(prev => ({
      ...prev,
      pageSize,
      page: 1,
    }))
  }, [])

  // Filter handlers
  const handleFilterChange = useCallback((value: string) => {
    setFilter(value)
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [])

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
    resetPagination: () =>
      setPagination({
        page: 1,
        pageSize: initialPageSize,
        total: data.length,
      }),
    resetFilter: () => setFilter(''),
    resetAll: () => {
      setSort(initialSort)
      setPagination({
        page: 1,
        pageSize: initialPageSize,
        total: data.length,
      })
      setFilter('')
    },
  }
}
