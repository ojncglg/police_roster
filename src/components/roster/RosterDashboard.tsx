/**
 * @file RosterDashboard.tsx
 * @description Main dashboard component for roster management.
 * Provides a central hub for all roster-related operations including
 * creation, modification, and training day management.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateRosterForm from './CreateRosterForm';
import RosterList from './RosterList';
import AddTrainingDayForm from './AddTrainingDayForm';

/**
 * Type defining possible dashboard views
 */
type DashboardView = 'menu' | 'create' | 'modify' | 'training' | 'modifyTraining';

/**
 * RosterDashboard Component
 * 
 * @component
 * @description Central dashboard for roster management with multiple views:
 * - Menu: Main navigation grid
 * - Create: New roster creation
 * - Modify: Existing roster modification
 * - Training: Add training days
 * - ModifyTraining: Modify existing training days
 */
const RosterDashboard = () => {
  // State for tracking active view
  const [activeView, setActiveView] = useState<DashboardView>('menu');
  const navigate = useNavigate();

  /**
   * Renders the appropriate content based on active view
   * @returns JSX for the selected view
   */
  const renderContent = () => {
    switch (activeView) {
      case 'create':
        return (
          <div>
            {/* Create Roster View Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Create New Roster</h2>
              <button 
                onClick={() => setActiveView('menu')}
                className="text-gray-600 hover:text-gray-800"
                aria-label="Close"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <title>Close</title>
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>
            <CreateRosterForm />
          </div>
        );
      
      case 'modify':
        return (
          <div>
            {/* Modify Roster View Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Modify Existing Roster</h2>
              <button 
                onClick={() => setActiveView('menu')}
                className="text-gray-600 hover:text-gray-800"
                aria-label="Close"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <title>Close</title>
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>
            <RosterList />
          </div>
        );

      case 'training':
        return (
          <div>
            {/* Add Training Day View Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Add Training Day</h2>
              <button 
                onClick={() => setActiveView('menu')}
                className="text-gray-600 hover:text-gray-800"
                aria-label="Close"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <title>Close</title>
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 mb-4">Select a date and add details for the training day.</p>
              <AddTrainingDayForm onClose={() => setActiveView('menu')} />
            </div>
          </div>
        );

      case 'modifyTraining':
        return (
          <div>
            {/* Modify Training Day View Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Modify Training Day</h2>
              <button 
                onClick={() => setActiveView('menu')}
                className="text-gray-600 hover:text-gray-800"
                aria-label="Close"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <title>Close</title>
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 mb-4">Select a training day to modify or remove.</p>
              {/* Training day modification functionality to be implemented */}
            </div>
          </div>
        );

      default:
        // Main Menu Grid
        return (
          <div className="grid gap-6 md:grid-cols-5 max-w-7xl mx-auto">
            {/* Create New Roster Card */}
            <div 
              onClick={() => setActiveView('create')}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500"
              role="button"
              aria-label="Create New Roster"
            >
              <div className="flex flex-col items-center">
                <svg 
                  className="w-16 h-16 text-blue-500 mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <title>Create New Roster</title>
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 4v16m8-8H4" 
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">Create New Roster</h3>
                <p className="mt-2 text-gray-600 text-center">
                  Start fresh with a new roster schedule
                </p>
              </div>
            </div>

            {/* Modify Existing Roster Card */}
            <div 
              onClick={() => setActiveView('modify')}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500"
              role="button"
              aria-label="Modify Existing Roster"
            >
              <div className="flex flex-col items-center">
                <svg 
                  className="w-16 h-16 text-blue-500 mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <title>Modify Roster</title>
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">Modify Existing Roster</h3>
                <p className="mt-2 text-gray-600 text-center">
                  View and edit existing roster schedules
                </p>
              </div>
            </div>

            {/* View Daily Roster Card */}
            <div 
              onClick={() => navigate('/dashboard/daily-roster')}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500"
              role="button"
              aria-label="View Daily Roster"
            >
              <div className="flex flex-col items-center">
                <svg 
                  className="w-16 h-16 text-blue-500 mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <title>Daily Roster</title>
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">View Daily Roster</h3>
                <p className="mt-2 text-gray-600 text-center">
                  View today's roster assignments
                </p>
              </div>
            </div>

            {/* Add Training Day Card */}
            <div 
              onClick={() => setActiveView('training')}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500"
              role="button"
              aria-label="Add Training Day"
            >
              <div className="flex flex-col items-center">
                <svg 
                  className="w-16 h-16 text-blue-500 mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <title>Add Training Day</title>
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">Add Training Day</h3>
                <p className="mt-2 text-gray-600 text-center">
                  Schedule a training day for officers
                </p>
              </div>
            </div>

            {/* Modify Training Day Card */}
            <div 
              onClick={() => setActiveView('modifyTraining')}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500"
              role="button"
              aria-label="Modify Training Day"
            >
              <div className="flex flex-col items-center">
                <svg 
                  className="w-16 h-16 text-blue-500 mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <title>Modify Training Day</title>
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">Modify Training Day</h3>
                <p className="mt-2 text-gray-600 text-center">
                  Edit or remove existing training days
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      {renderContent()}
    </div>
  );
};

export default RosterDashboard;
