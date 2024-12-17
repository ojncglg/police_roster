import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHotkeys } from './useHotkeys';
import { notificationService } from '../services/notificationService';

interface UseRosterShortcutsOptions {
  onAddOfficer?: () => void;
  onPrint?: () => void;
  onExport?: () => void;
  onSearch?: () => void;
  onRefresh?: () => void;
}

export function useRosterShortcuts({
  onAddOfficer,
  onPrint,
  onExport,
  onSearch,
  onRefresh
}: UseRosterShortcutsOptions = {}) {
  const navigate = useNavigate();

  // Navigation shortcuts
  useHotkeys([
    {
      combo: ['g o', 'ctrl+1'],
      handler: () => navigate('/officers'),
      options: {
        description: 'Go to Officers',
      }
    },
    {
      combo: ['g r', 'ctrl+2'],
      handler: () => navigate('/roster'),
      options: {
        description: 'Go to Roster',
      }
    },
    {
      combo: ['g d', 'ctrl+3'],
      handler: () => navigate('/docs'),
      options: {
        description: 'Go to Documentation',
      }
    }
  ]);

  // Action shortcuts
  useHotkeys([
    {
      combo: ['ctrl+n', 'cmd+n'],
      handler: (e) => {
        e.preventDefault();
        if (onAddOfficer) {
          onAddOfficer();
        }
      },
      options: {
        description: 'Add New Officer',
        preventDefault: true
      }
    },
    {
      combo: ['ctrl+p', 'cmd+p'],
      handler: (e) => {
        e.preventDefault();
        if (onPrint) {
          onPrint();
        }
      },
      options: {
        description: 'Print Current View',
        preventDefault: true
      }
    },
    {
      combo: ['ctrl+e', 'cmd+e'],
      handler: (e) => {
        e.preventDefault();
        if (onExport) {
          onExport();
        }
      },
      options: {
        description: 'Export to PDF',
        preventDefault: true
      }
    }
  ]);

  // Search and refresh shortcuts
  useHotkeys([
    {
      combo: ['ctrl+k', 'cmd+k'],
      handler: (e) => {
        e.preventDefault();
        if (onSearch) {
          onSearch();
        }
      },
      options: {
        description: 'Focus Search',
        preventDefault: true
      }
    },
    {
      combo: ['ctrl+r', 'cmd+r', 'F5'],
      handler: (e) => {
        e.preventDefault();
        if (onRefresh) {
          onRefresh();
        }
      },
      options: {
        description: 'Refresh Data',
        preventDefault: true
      }
    }
  ]);

  // Help shortcut
  useHotkeys({
    combo: '?',
    handler: () => {
      notificationService.info(
        'Keyboard Shortcuts:\n\n' +
        'g o / Ctrl+1: Go to Officers\n' +
        'g r / Ctrl+2: Go to Roster\n' +
        'g d / Ctrl+3: Go to Documentation\n' +
        'Ctrl+N: Add New Officer\n' +
        'Ctrl+P: Print Current View\n' +
        'Ctrl+E: Export to PDF\n' +
        'Ctrl+K: Focus Search\n' +
        'Ctrl+R / F5: Refresh Data\n' +
        '?: Show this help message'
      );
    },
    options: {
      description: 'Show Keyboard Shortcuts Help'
    }
  });

  // Show keyboard shortcuts hint on first visit
  useEffect(() => {
    const hasSeenHint = localStorage.getItem('roster_shortcuts_hint');
    if (!hasSeenHint) {
      notificationService.info(
        'Press ? to view keyboard shortcuts',
        8000
      );
      localStorage.setItem('roster_shortcuts_hint', 'true');
    }
  }, []);

  // Cleanup function
  useEffect(() => {
    return () => {
      // Any cleanup needed for shortcuts
    };
  }, []);
}

// Export types
export type { UseRosterShortcutsOptions };
