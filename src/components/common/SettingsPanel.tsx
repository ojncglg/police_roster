import { type FC, type ChangeEvent, useState } from 'react';
import { useAppSettings } from '../../hooks/useAppSettings';
import { notificationService } from '../../services/notificationService';
import Button from './Button';
import Modal from './Modal';
import { ThemeSelect } from './ThemeToggle';
import Select from './Select';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

type TabId = 'general' | 'appearance' | 'shortcuts';

const SettingsPanel: FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
    const { settings, updatePreferences, resetAllSettings } = useAppSettings();
    const [activeTab, setActiveTab] = useState<TabId>('general');
    const [fontSize, setFontSize] = useState('16');

    const tabs = [
        { id: 'general' as const, label: 'General' },
        { id: 'appearance' as const, label: 'Appearance' },
        { id: 'shortcuts' as const, label: 'Shortcuts' },
    ];

    const handleFontSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFontSize(e.target.value);
        // TODO: Implement font size update logic
    };

    const handleResetShortcuts = () => {
        // TODO: Implement shortcut reset logic
        notificationService.info('Shortcuts have been reset to defaults');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Settings" size="large">
            <div className="flex h-[600px]">
                {/* Sidebar */}
                <div className="w-48 border-r border-gray-200 dark:border-gray-700 p-4">
                    <nav className="space-y-1" role="tablist" aria-label="Settings sections">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                aria-controls={`${tab.id}-panel`}
                                className={`
                                    w-full px-3 py-2 text-sm font-medium rounded-md
                                    transition-colors duration-200
                                    ${activeTab === tab.id 
                                        ? 'bg-police-yellow text-black' 
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }
                                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-y-auto bg-white dark:bg-gray-800">
                    {/* General Settings */}
                    <div 
                        role="tabpanel"
                        id="general-panel"
                        aria-labelledby="general-tab"
                        hidden={activeTab !== 'general'}
                        className="space-y-6"
                    >
                        {activeTab === 'general' && (
                            <>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">General Settings</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label 
                                            htmlFor="notifications"
                                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Show Notifications
                                        </label>
                                        <input
                                            id="notifications"
                                            type="checkbox"
                                            checked={settings.preferences.showNotifications}
                                            onChange={(e) => updatePreferences({ showNotifications: e.target.checked })}
                                            className="h-4 w-4 text-police-yellow focus:ring-police-yellow border-gray-300 dark:border-gray-600 rounded"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label 
                                            htmlFor="autoSave"
                                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Auto Save
                                        </label>
                                        <input
                                            id="autoSave"
                                            type="checkbox"
                                            checked={settings.preferences.autoSave}
                                            onChange={(e) => updatePreferences({ autoSave: e.target.checked })}
                                            className="h-4 w-4 text-police-yellow focus:ring-police-yellow border-gray-300 dark:border-gray-600 rounded"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label 
                                            htmlFor="compactView"
                                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Compact View
                                        </label>
                                        <input
                                            id="compactView"
                                            type="checkbox"
                                            checked={settings.preferences.compactView}
                                            onChange={(e) => updatePreferences({ compactView: e.target.checked })}
                                            className="h-4 w-4 text-police-yellow focus:ring-police-yellow border-gray-300 dark:border-gray-600 rounded"
                                        />
                                    </div>

                                    <div>
                                        <label 
                                            htmlFor="defaultView"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Default View
                                        </label>
                                        <Select
                                            id="defaultView"
                                            value={settings.preferences.defaultView}
                                            onChange={(e: ChangeEvent<HTMLSelectElement>) => 
                                                updatePreferences({ defaultView: e.target.value as 'officers' | 'roster' })
                                            }
                                            className="mt-1"
                                            options={[
                                                { value: 'officers', label: 'Officers' },
                                                { value: 'roster', label: 'Roster' },
                                            ]}
                                        />
                                    </div>

                                    <div>
                                        <label 
                                            htmlFor="pageSize"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Items per Page
                                        </label>
                                        <Select
                                            id="pageSize"
                                            value={settings.preferences.pageSize.toString()}
                                            onChange={(e: ChangeEvent<HTMLSelectElement>) => 
                                                updatePreferences({ pageSize: Number(e.target.value) })
                                            }
                                            className="mt-1"
                                            options={[
                                                { value: '10', label: '10' },
                                                { value: '25', label: '25' },
                                                { value: '50', label: '50' },
                                                { value: '100', label: '100' },
                                            ]}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Appearance Settings */}
                    <div 
                        role="tabpanel"
                        id="appearance-panel"
                        aria-labelledby="appearance-tab"
                        hidden={activeTab !== 'appearance'}
                        className="space-y-6"
                    >
                        {activeTab === 'appearance' && (
                            <>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Appearance Settings</h3>
                                <div className="space-y-6">
                                    <ThemeSelect />

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Color Scheme
                                        </label>
                                        <div 
                                            className="grid grid-cols-3 gap-4"
                                            role="radiogroup"
                                            aria-label="Color scheme selection"
                                        >
                                            {['Default', 'High Contrast', 'Colorful'].map(scheme => (
                                                <button
                                                    key={scheme}
                                                    role="radio"
                                                    aria-checked={scheme === 'Default'}
                                                    className={`
                                                        p-4 rounded-lg border-2 text-center
                                                        text-gray-700 dark:text-gray-300
                                                        transition-colors duration-200
                                                        ${scheme === 'Default' 
                                                            ? 'border-police-yellow bg-gray-50 dark:bg-gray-700' 
                                                            : 'border-gray-200 dark:border-gray-600'
                                                        }
                                                    `}
                                                >
                                                    {scheme}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label 
                                            htmlFor="fontSize"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                        >
                                            Font Size
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <input
                                                id="fontSize"
                                                type="range"
                                                min="12"
                                                max="20"
                                                value={fontSize}
                                                onChange={handleFontSizeChange}
                                                className="flex-1"
                                                aria-valuemin={12}
                                                aria-valuemax={20}
                                                aria-valuenow={Number(fontSize)}
                                            />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {fontSize}px
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Shortcuts Settings */}
                    <div 
                        role="tabpanel"
                        id="shortcuts-panel"
                        aria-labelledby="shortcuts-tab"
                        hidden={activeTab !== 'shortcuts'}
                        className="space-y-6"
                    >
                        {activeTab === 'shortcuts' && (
                            <>
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                        Keyboard Shortcuts
                                    </h3>
                                    <Button
                                        variant="outline"
                                        size="small"
                                        onClick={handleResetShortcuts}
                                        aria-label="Reset shortcuts to default values"
                                    >
                                        Reset to Defaults
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { action: 'Navigate to Officers', keys: 'G O' },
                                        { action: 'Navigate to Roster', keys: 'G R' },
                                        { action: 'Add New Officer', keys: 'Ctrl + N' },
                                        { action: 'Search', keys: 'Ctrl + K' },
                                        { action: 'Save Changes', keys: 'Ctrl + S' },
                                        { action: 'Show Help', keys: '?' },
                                    ].map(shortcut => (
                                        <div 
                                            key={shortcut.action} 
                                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                        >
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {shortcut.action}
                                            </span>
                                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-sm font-mono">
                                                {shortcut.keys}
                                            </kbd>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-between">
                <Button 
                    variant="outline" 
                    onClick={resetAllSettings}
                    aria-label="Reset all settings to default values"
                >
                    Reset All Settings
                </Button>
                <Button 
                    variant="primary" 
                    onClick={onClose}
                    aria-label="Close settings panel"
                >
                    Close
                </Button>
            </div>
        </Modal>
    );
};

export default SettingsPanel;
