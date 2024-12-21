import { useState, useEffect, useCallback } from 'react';
import type { Officer, OfficerFormData } from '../types/officer';
import { officerService } from '../services/officerService';

interface UseOfficersResult {
  officers: Officer[];
  loading: boolean;
  error: Error | null;
  updateOfficer: (id: string, data: OfficerFormData) => Promise<void>;
  deleteOfficer: (id: string) => Promise<void>;
  createOfficer: (data: OfficerFormData) => Promise<void>;
}

export const useOfficers = (): UseOfficersResult => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadOfficers = useCallback(() => {
    try {
      const data = officerService.getOfficers();
      setOfficers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch officers'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load and subscribe to changes
  useEffect(() => {
    // Initial load
    loadOfficers();

    // Subscribe to both local changes and storage events
    officerService.addChangeListener(loadOfficers);
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'nccpd_officers') {
        loadOfficers();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      officerService.removeChangeListener(loadOfficers);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadOfficers]);

  const updateOfficer = async (id: string, data: OfficerFormData): Promise<void> => {
    try {
      await officerService.updateOfficer(id, data);
      loadOfficers(); // Refresh the list after update
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update officer'));
      throw err;
    }
  };

  const deleteOfficer = async (id: string): Promise<void> => {
    try {
      await officerService.deleteOfficer(id);
      loadOfficers(); // Refresh the list after deletion
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete officer'));
      throw err;
    }
  };

  const createOfficer = async (data: OfficerFormData): Promise<void> => {
    try {
      await officerService.createOfficer(data);
      loadOfficers(); // Refresh the list after creation
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create officer'));
      throw err;
    }
  };

  return { officers, loading, error, updateOfficer, deleteOfficer, createOfficer };
};
