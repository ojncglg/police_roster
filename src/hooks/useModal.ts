import { useState, useCallback } from 'react';

interface UseModalOptions {
  initialOpen?: boolean;
  onOpen?: () => void | Promise<void>;
  onClose?: () => void | Promise<void>;
}

export function useModal({
  initialOpen = false,
  onOpen,
  onClose
}: UseModalOptions = {}) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isProcessing, setIsProcessing] = useState(false);

  const open = useCallback(async () => {
    if (onOpen) {
      setIsProcessing(true);
      try {
        await onOpen();
      } finally {
        setIsProcessing(false);
      }
    }
    setIsOpen(true);
  }, [onOpen]);

  const close = useCallback(async () => {
    if (onClose) {
      setIsProcessing(true);
      try {
        await onClose();
      } finally {
        setIsProcessing(false);
      }
    }
    setIsOpen(false);
  }, [onClose]);

  const toggle = useCallback(async () => {
    if (isOpen) {
      await close();
    } else {
      await open();
    }
  }, [isOpen, open, close]);

  return {
    isOpen,
    isProcessing,
    open,
    close,
    toggle
  };
}

// Utility type for modal state management
export interface ModalState<T = undefined> {
  data: T | undefined;
  isOpen: boolean;
}

type ModalStateConfig = {
  [key: string]: { data?: any };
};

type ModalStates<T extends ModalStateConfig> = {
  [K in keyof T]: ModalState<T[K]['data']>;
};

// Hook for managing multiple modals
export function useModals<T extends ModalStateConfig>(
  initialState: { [K in keyof T]: Omit<ModalState<T[K]['data']>, 'data'> }
) {
  const [modals, setModals] = useState<ModalStates<T>>(() => {
    const initialModals = {} as ModalStates<T>;
    for (const key in initialState) {
      initialModals[key] = {
        ...initialState[key],
        data: undefined
      };
    }
    return initialModals;
  });

  const openModal = useCallback(<K extends keyof T>(
    modalKey: K,
    data?: T[K]['data']
  ) => {
    setModals(prev => ({
      ...prev,
      [modalKey]: {
        isOpen: true,
        data
      }
    }));
  }, []);

  const closeModal = useCallback(<K extends keyof T>(modalKey: K) => {
    setModals(prev => ({
      ...prev,
      [modalKey]: {
        isOpen: false,
        data: undefined
      }
    }));
  }, []);

  const updateModalData = useCallback(<K extends keyof T>(
    modalKey: K,
    data: Partial<NonNullable<T[K]['data']>>
  ) => {
    setModals(prev => ({
      ...prev,
      [modalKey]: {
        ...prev[modalKey],
        data: {
          ...(prev[modalKey].data as any),
          ...data
        }
      }
    }));
  }, []);

  return {
    modals,
    openModal,
    closeModal,
    updateModalData
  };
}

// Example usage:
/*
interface ModalsConfig {
  createRoster: {
    data?: {
      initialName?: string;
      startDate?: string;
    };
  };
  deleteRoster: {
    data: {
      rosterId: string;
      rosterName: string;
    };
  };
  assignShift: {
    data: {
      rosterId: string;
      date: string;
    };
  };
}

const initialModals = {
  createRoster: { isOpen: false },
  deleteRoster: { isOpen: false },
  assignShift: { isOpen: false }
};

const { modals, openModal, closeModal } = useModals<ModalsConfig>(initialModals);

// Open create roster modal
openModal('createRoster', { initialName: 'New Roster' });

// Open delete roster modal
openModal('deleteRoster', { rosterId: '123', rosterName: 'Main Roster' });

// Close modal
closeModal('createRoster');
*/
