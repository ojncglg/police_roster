import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useRosterShortcuts } from '../../hooks/useRosterShortcuts';
import Button from '../common/Button';
import ErrorBoundary from '../common/ErrorBoundary';
import MiniCalendar from '../common/MiniCalendar';
import NotificationContainer from '../common/NotificationContainer';
import SettingsPanel from '../common/SettingsPanel';
import ShortcutsHelp from '../common/ShortcutsHelp';
import ThemeToggle from '../common/ThemeToggle';

const AppLayout = () => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);
    const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);

    // Set up keyboard shortcuts
    useRosterShortcuts({
        onSearch: () => {
            const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement;
            if (searchInput) {
                searchInput.focus();
            }
        },
        onRefresh: () => {
            window.location.reload();
        },
    });

    // Don't show layout on login page
    if (location.pathname === '/login') {
        return (
            <ErrorBoundary>
                <Outlet />
                <NotificationContainer />
            </ErrorBoundary>
        );
    }

    const navigationItems = [
        {
            title: 'Daily Roster',
            description: "View today's roster assignments",
            path: '/dashboard/daily-roster',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <title>Daily Roster</title>
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                </svg>
            ),
        },
        {
            title: 'Officers',
            description: 'Manage officer information',
            path: '/dashboard/officers',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <title>Officers</title>
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
            ),
        },
        {
            title: 'Roster',
            description: 'Manage roster schedules',
            path: '/dashboard/roster',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <title>Roster</title>
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                </svg>
            ),
        },
        {
            title: 'Approve Vacation',
            description: 'Approve vacation requests',
            path: '/dashboard/approve-vacation',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <title>Approve Vacation</title>
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                    />
                </svg>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white dark:bg-gray-800 shadow-lg print:hidden">
                <div className="p-4">
                    <Link to="/dashboard" className="flex flex-col items-start mb-8">
                        <span className="text-xl font-bold text-police-yellow">NCCPD Roster</span>
                        <span className="text-sm font-semibold text-police-yellow mt-1">
                            Squad {user?.squad} Management
                        </span>
                    </Link>

                    {/* Mini Calendar */}
                    <div className="mb-8">
                        <MiniCalendar />
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-4">
                        {navigationItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.path}
                                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                    location.pathname === item.path ? 'bg-gray-100 dark:bg-gray-700' : ''
                                }`}
                            >
                                <div className="text-police-yellow">{item.icon}</div>
                                <div>
                                    <div className="font-medium text-gray-900 dark:text-white">{item.title}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{item.description}</div>
                                </div>
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-police-black shadow-md print:hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-end items-center h-16">
                            {/* User Menu */}
                            <div className="flex items-center space-x-4">
                                <div className="flex flex-col items-end">
                                    <span className="text-gray-300 text-sm hidden md:block">{user?.username}</span>
                                    <span className="text-police-yellow text-sm font-semibold hidden md:block">
                                        Squad {user?.squad} Admin
                                    </span>
                                </div>

                                {/* Theme Toggle */}
                                <ThemeToggle size="small" />

                                {/* Settings Button */}
                                <button onClick={() => setIsSettingsPanelOpen(true)} className="text-gray-300 hover:text-police-yellow p-2 rounded-md" title="Settings">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <title>Settings</title>
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                        />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>

                                {/* Shortcuts Help Button */}
                                <button onClick={() => setIsShortcutsHelpOpen(true)} className="text-gray-300 hover:text-police-yellow p-2 rounded-md" title="Keyboard Shortcuts (Press ?)">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <title>Keyboard Shortcuts</title>
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                        />
                                    </svg>
                                </button>

                                {/* Logout Button */}
                                <Button
                                    variant="outline"
                                    size="small"
                                    onClick={logout}
                                    className="text-police-yellow border-police-yellow hover:bg-gray-800"
                                    icon={
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <title>Logout</title>
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                            />
                                        </svg>
                                    }
                                >
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8">
                    <ErrorBoundary>
                        <Outlet />
                    </ErrorBoundary>
                </main>

                {/* Footer */}
                <footer className="bg-police-black text-gray-300 border-t border-gray-800 print:hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="text-center">
                            <p className="text-sm">© {new Date().getFullYear()} NCCPD Roster Management System</p>
                            <p className="text-sm text-police-yellow mt-1">Squad {user?.squad} Management Portal</p>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Modals */}
            <ShortcutsHelp isOpen={isShortcutsHelpOpen} onClose={() => setIsShortcutsHelpOpen(false)} />

            <SettingsPanel isOpen={isSettingsPanelOpen} onClose={() => setIsSettingsPanelOpen(false)} />

            {/* Notifications */}
            <NotificationContainer />
        </div>
    );
};

export default AppLayout;
