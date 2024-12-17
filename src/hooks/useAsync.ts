import { useState, useCallback, useEffect } from 'react';
import { notificationService } from '../services/notificationService';

interface UseAsyncOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  immediate?: boolean;
  showErrorNotification?: boolean;
  showSuccessNotification?: boolean;
  successMessage?: string;
}

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  {
    onSuccess,
    onError,
    immediate = false,
    showErrorNotification = true,
    showSuccessNotification = false,
    successMessage = 'Operation completed successfully'
  }: UseAsyncOptions<T> = {}
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false
  });

  const execute = useCallback(async () => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null
    }));

    try {
      const data = await asyncFunction();
      setState({
        data,
        error: null,
        isLoading: false,
        isSuccess: true,
        isError: false
      });

      if (showSuccessNotification) {
        notificationService.success(successMessage);
      }

      onSuccess?.(data);
      return data;
    } catch (error) {
      const errorObject = error instanceof Error ? error : new Error('An error occurred');
      setState({
        data: null,
        error: errorObject,
        isLoading: false,
        isSuccess: false,
        isError: true
      });

      if (showErrorNotification) {
        notificationService.error(errorObject.message);
      }

      onError?.(errorObject);
      throw errorObject;
    }
  }, [asyncFunction, onSuccess, onError, showErrorNotification, showSuccessNotification, successMessage]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute
  };
}

// Hook for managing multiple async operations
export function useAsyncOperations<T extends Record<string, () => Promise<any>>>(
  operations: T,
  options: {
    [K in keyof T]?: Omit<UseAsyncOptions<Awaited<ReturnType<T[K]>>>, 'immediate'>;
  } = {}
) {
  type OperationResults = {
    [K in keyof T]: AsyncState<Awaited<ReturnType<T[K]>>> & {
      execute: () => Promise<Awaited<ReturnType<T[K]>>>;
    };
  };

  const results = {} as OperationResults;

  for (const key in operations) {
    const operation = operations[key];
    const operationOptions = options[key] || {};
    
    // eslint-disable-next-line react-hooks/rules-of-hooks
    results[key] = useAsync(operation, {
      ...operationOptions,
      immediate: false
    });
  }

  const isAnyLoading = Object.values(results).some(result => result.isLoading);
  const hasAnyError = Object.values(results).some(result => result.isError);
  const isAllSuccess = Object.values(results).every(result => result.isSuccess);

  return {
    operations: results,
    isAnyLoading,
    hasAnyError,
    isAllSuccess
  };
}

// Example usage:
/*
// Single async operation
const { data, error, isLoading, execute } = useAsync(
  () => fetchRosterData(rosterId),
  {
    onSuccess: (data) => console.log('Roster loaded:', data),
    onError: (error) => console.error('Failed to load roster:', error),
    showErrorNotification: true,
    successMessage: 'Roster loaded successfully'
  }
);

// Multiple async operations
const { operations, isAnyLoading } = useAsyncOperations({
  fetchRoster: () => fetchRosterData(rosterId),
  fetchOfficers: () => fetchOfficersList(),
  fetchShifts: () => fetchShiftsList()
}, {
  fetchRoster: {
    successMessage: 'Roster loaded successfully'
  },
  fetchOfficers: {
    successMessage: 'Officers loaded successfully'
  }
});

// Access individual operation states
const { data: rosterData, isLoading: isRosterLoading } = operations.fetchRoster;
const { data: officersData, isLoading: isOfficersLoading } = operations.fetchOfficers;
*/
