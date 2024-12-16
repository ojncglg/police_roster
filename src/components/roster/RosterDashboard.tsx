import { useState } from 'react';
import CreateRosterForm from './CreateRosterForm';
import RosterList from './RosterList';

const RosterDashboard = () => {
  const [activeView, setActiveView] = useState<'menu' | 'create' | 'modify'>('menu');

  const renderContent = () => {
    switch (activeView) {
      case 'create':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Create New Roster</h2>
              <button 
                onClick={() => setActiveView('menu')}
                className="text-gray-600 hover:text-gray-800"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Modify Existing Roster</h2>
              <button 
                onClick={() => setActiveView('menu')}
                className="text-gray-600 hover:text-gray-800"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
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

      default:
        return (
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <div 
              onClick={() => setActiveView('create')}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500"
            >
              <div className="flex flex-col items-center">
                <svg 
                  className="w-16 h-16 text-blue-500 mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
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

            <div 
              onClick={() => setActiveView('modify')}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500"
            >
              <div className="flex flex-col items-center">
                <svg 
                  className="w-16 h-16 text-blue-500 mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
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
