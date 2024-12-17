import React from 'react';
import Modal from './Modal';

interface ShortcutGroup {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
  }[];
}

interface ShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShortcutsHelp: React.FC<ShortcutsHelpProps> = ({ isOpen, onClose }) => {
  const shortcutGroups: ShortcutGroup[] = [
    {
      title: 'Navigation',
      shortcuts: [
        { keys: ['G', 'O'], description: 'Go to Officers' },
        { keys: ['G', 'R'], description: 'Go to Roster' },
        { keys: ['G', 'D'], description: 'Go to Documentation' },
        { keys: ['Ctrl', '1-3'], description: 'Quick navigation' },
      ]
    },
    {
      title: 'Actions',
      shortcuts: [
        { keys: ['Ctrl', 'N'], description: 'Add new officer' },
        { keys: ['Ctrl', 'P'], description: 'Print current view' },
        { keys: ['Ctrl', 'E'], description: 'Export to PDF' },
        { keys: ['Ctrl', 'S'], description: 'Save changes' },
      ]
    },
    {
      title: 'Search & Refresh',
      shortcuts: [
        { keys: ['Ctrl', 'K'], description: 'Focus search' },
        { keys: ['Ctrl', 'R'], description: 'Refresh data' },
        { keys: ['F5'], description: 'Refresh page' },
      ]
    },
    {
      title: 'Other',
      shortcuts: [
        { keys: ['?'], description: 'Show this help' },
        { keys: ['Esc'], description: 'Close modal/popup' },
      ]
    }
  ];

  const renderKey = (key: string) => (
    <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-gray-100 text-gray-800 text-sm font-mono rounded border border-gray-300 shadow-sm">
      {key}
    </span>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Keyboard Shortcuts"
      size="large"
    >
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {shortcutGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {group.title}
              </h3>
              <div className="space-y-4">
                {group.shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center space-x-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <React.Fragment key={keyIndex}>
                          {keyIndex > 0 && (
                            <span className="text-gray-400 mx-1">+</span>
                          )}
                          {renderKey(key)}
                        </React.Fragment>
                      ))}
                    </div>
                    <span className="text-gray-600 ml-4">
                      {shortcut.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Pro Tips
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
            <li>
              Press <strong>?</strong> at any time to show this help dialog
            </li>
            <li>
              Use <strong>Tab</strong> to navigate through form fields
            </li>
            <li>
              Hold <strong>Shift</strong> while clicking to select multiple items
            </li>
            <li>
              Double-click on a row to view detailed information
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500 text-center">
          Tip: You can customize these shortcuts in your profile settings
        </div>
      </div>
    </Modal>
  );
};

export default ShortcutsHelp;
