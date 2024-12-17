import type React from 'react';
import { useState } from 'react';
import { useAppSettings } from '../../hooks/useAppSettings';
import { useDarkMode } from '../../hooks/useDarkMode';
import { notificationService } from '../../services/notificationService';
import Button from './Button';
import Modal from './Modal';
import { ThemeSelect } from './ThemeToggle';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
    const { settings, updatePreferences, resetAllSettings } = useAppSettings();

    const { isDark } = useDarkMode();

    const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'shortcuts'>('general');

    const tabs = [
        { id: 'general', label: 'General' },
        { id: 'appearance', label: 'Appearance' },
        { id: 'shortcuts', label: 'Shortcuts' },
    ] as const;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Settings" size="large">
            <div className="flex h-[600px]">
                {/* Sidebar */}
                <div className="w-48 border-r border-gray-200 dark:border-gray-700 p-4">
                    <nav className="space-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                  w-full px-3 py-2 text-sm font-medium rounded-md
                  transition-colors duration-200
                  ${activeTab === tab.id ? 'bg-police-yellow text-black' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}
                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-y-auto bg-white dark:bg-gray-800">
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">General Settings</h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Show Notifications</span>
                                    <input
                                        type="checkbox"
                                        checked={settings.preferences.showNotifications}
                                        onChange={e => updatePreferences({ showNotifications: e.target.checked })}
                                        className="h-4 w-4 text-police-yellow focus:ring-police-yellow border-gray-300 rounded"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto Save</span>
                                    <input
                                        type="checkbox"
                                        checked={settings.preferences.autoSave}
                                        onChange={e => updatePreferences({ autoSave: e.target.checked })}
                                        className="h-4 w-4 text-police-yellow focus:ring-police-yellow border-gray-300 rounded"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Compact View</span>
                                    <input
                                        type="checkbox"
                                        checked={settings.preferences.compactView}
                                        onChange={e => updatePreferences({ compactView: e.target.checked })}
                                        className="h-4 w-4 text-police-yellow focus:ring-police-yellow border-gray-300 rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Default View</label>
                                    <Select
                                        value={settings.preferences.defaultView}
                                        onChange={e => updatePreferences({ defaultView: e.target.value as 'officers' | 'roster' })}
                                        className="mt-1"
                                        options={[
                                            { value: 'officers', label: 'Officers' },
                                            { value: 'roster', label: 'Roster' },
                                        ]}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Items per Page</label>
                                    <Select
                                        value={settings.preferences.pageSize.toString()}
                                        onChange={e => updatePreferences({ pageSize: Number(e.target.value) })}
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
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Appearance Settings</h3>

                            <div className="space-y-6">
                                <ThemeSelect />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color Scheme</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {['Default', 'High Contrast', 'Colorful'].map(scheme => (
                                            <button
                                                key={scheme}
                                                className={`
                          p-4 rounded-lg border-2 text-center
                          ${scheme === 'Default' ? 'border-police-yellow bg-gray-50 dark:bg-gray-700' : 'border-gray-200 dark:border-gray-600'}
                        `}
                                            >
                                                {scheme}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Font Size</label>
                                    <div className="flex items-center space-x-4">
                                        <input type="range" min="12" max="20" value="16" className="flex-1" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">16px</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'shortcuts' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Keyboard Shortcuts</h3>
                                <Button
                                    variant="outline"
                                    size="small"
                                    onClick={() => {
                                        notificationService.info('Shortcuts have been reset to defaults');
                                    }}
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
                                    <div key={shortcut.action} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{shortcut.action}</span>
                                        <code className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-sm font-mono">{shortcut.keys}</code>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-between">
                <Button variant="outline" onClick={resetAllSettings}>
                    Reset All Settings
                </Button>
                <Button variant="primary" onClick={onClose}>
                    Close
                </Button>
            </div>
        </Modal>
    );
};

export default SettingsPanel;
