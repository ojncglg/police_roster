import { useEffect, useCallback, useRef } from 'react';

type KeyCombo = string | string[];
type Handler = (event: KeyboardEvent) => void;
type Options = {
  enabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  repeat?: boolean;
  keyup?: boolean;
  keydown?: boolean;
  excludeInputs?: boolean;
  description?: string;
};

interface HotkeyConfig {
  combo: KeyCombo;
  handler: Handler;
  options?: Options;
}

const defaultOptions: Required<Options> = {
  enabled: true,
  preventDefault: true,
  stopPropagation: true,
  repeat: false,
  keyup: false,
  keydown: true,
  excludeInputs: true,
  description: '',
};

function normalizeKeyCombo(combo: KeyCombo): string[] {
  if (Array.isArray(combo)) {
    return combo.map(c => c.toLowerCase());
  }
  return [combo.toLowerCase()];
}

function isInputElement(element: Element | null): boolean {
  if (!element) return false;
  const tag = element.tagName.toLowerCase();
  return (
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    element.getAttribute('contenteditable') === 'true'
  );
}

function matchesKeyCombo(event: KeyboardEvent, combo: string[]): boolean {
  const pressedKeys: string[] = [];
  
  if (event.ctrlKey || event.metaKey) pressedKeys.push('ctrl');
  if (event.altKey) pressedKeys.push('alt');
  if (event.shiftKey) pressedKeys.push('shift');
  
  pressedKeys.push(event.key.toLowerCase());
  
  const pressedCombo = pressedKeys.join('+');
  return combo.some(c => c === pressedCombo);
}

export function useHotkeys(hotkeys: HotkeyConfig | HotkeyConfig[]) {
  const configs = Array.isArray(hotkeys) ? hotkeys : [hotkeys];
  const handlersRef = useRef<HotkeyConfig[]>(configs);

  // Update handlers ref when configs change
  useEffect(() => {
    handlersRef.current = configs;
  }, [configs]);

  const handleKeyEvent = useCallback((event: KeyboardEvent) => {
    // Skip if target is an input element and excludeInputs is true
    if (
      isInputElement(event.target as Element) &&
      handlersRef.current.every(config => config.options?.excludeInputs !== false)
    ) {
      return;
    }

    handlersRef.current.forEach(({ combo, handler, options = {} }) => {
      const mergedOptions = { ...defaultOptions, ...options };
      
      // Skip if not enabled
      if (!mergedOptions.enabled) return;
      
      // Skip if it's a repeat event and repeat is false
      if (event.repeat && !mergedOptions.repeat) return;
      
      // Skip if event type doesn't match options
      if (
        (event.type === 'keydown' && !mergedOptions.keydown) ||
        (event.type === 'keyup' && !mergedOptions.keyup)
      ) {
        return;
      }

      const normalizedCombo = normalizeKeyCombo(combo);
      if (matchesKeyCombo(event, normalizedCombo)) {
        if (mergedOptions.preventDefault) {
          event.preventDefault();
        }
        if (mergedOptions.stopPropagation) {
          event.stopPropagation();
        }
        handler(event);
      }
    });
  }, []);

  useEffect(() => {
    if (configs.some(config => config.options?.keydown !== false)) {
      window.addEventListener('keydown', handleKeyEvent);
    }
    if (configs.some(config => config.options?.keyup === true)) {
      window.addEventListener('keyup', handleKeyEvent);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyEvent);
      window.removeEventListener('keyup', handleKeyEvent);
    };
  }, [handleKeyEvent]);
}

// Helper hook for managing application-wide hotkeys
export function useAppHotkeys() {
  useHotkeys([
    {
      combo: 'ctrl+k',
      handler: () => {
        // Implement search functionality
        console.log('Search hotkey pressed');
      },
      options: {
        description: 'Open search',
      },
    },
    {
      combo: 'esc',
      handler: () => {
        // Close modals, dropdowns, etc.
        console.log('Escape pressed');
      },
      options: {
        description: 'Close modal/dropdown',
      },
    },
    {
      combo: ['ctrl+s', 'cmd+s'],
      handler: (e) => {
        // Save current form/data
        console.log('Save hotkey pressed');
      },
      options: {
        description: 'Save changes',
      },
    },
  ]);
}

// Example usage:
/*
function MyComponent() {
  useHotkeys({
    combo: 'ctrl+enter',
    handler: () => {
      // Handle hotkey
      console.log('Ctrl+Enter pressed');
    },
    options: {
      enabled: true,
      preventDefault: true,
      excludeInputs: false,
      description: 'Submit form',
    },
  });

  // Multiple hotkeys
  useHotkeys([
    {
      combo: ['ctrl+c', 'cmd+c'],
      handler: () => console.log('Copy'),
      options: { description: 'Copy' },
    },
    {
      combo: ['ctrl+v', 'cmd+v'],
      handler: () => console.log('Paste'),
      options: { description: 'Paste' },
    },
  ]);

  return <div>Press Ctrl+Enter</div>;
}
*/
