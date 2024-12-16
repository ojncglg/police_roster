import { useEffect, useState } from 'react';
import { Roster } from '../../types/roster';
import { rosterService } from '../../services/rosterService';
import ShiftAssignmentComponent from './ShiftAssignment';
import CalendarView from './CalendarView';

const RosterList = () => {
  const [rosters, setRosters] = useState<Roster[]>([]);
  const [selectedRoster, setSelectedRoster] = useState<Roster | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'assignments' | 'calendar'>('details');

  useEffect(() => {
    loadRosters();
  }, []);

  const loadRosters = () => {
    try {
      const allRosters = rosterService.getAllRosters();
      setRosters(allRosters);
    } catch (error) {
      console.error('Error loading rosters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoster = (id: string) => {
    if (window.confirm('Are you sure you want to delete this roster?')) {
      try {
        rosterService.deleteRoster(id);
        loadRosters(); // Refresh the list
      } catch (error) {
        console.error('Error deleting roster:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleAssignmentUpdate = () => {
    // Refresh the roster data after assignment changes
    if (selectedRoster) {
      const updatedRoster = rosterService.getRoster(selectedRoster.id);
      if (updatedRoster) {
        setSelectedRoster(updatedRoster);
        loadRosters(); // Also refresh the main list
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (rosters.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600 text-center">No rosters found. Create a new roster to get started.</p>
      </div>
    );
  }

  if (selectedRoster) {
    return (
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b">
          <div className="flex justify-between items-center p-6">
            <h3 className="text-xl font-bold text-gray-800">{selectedRoster.name}</h3>
            <button
              onClick={() => {
                setSelectedRoster(null);
                setActiveTab('details');
              }}
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

          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'details'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'assignments'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('assignments')}
            >
              Shift Assignments
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'calendar'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('calendar')}
            >
              Calendar View
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Roster Details */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Schedule</h4>
                <p className="text-gray-600">
                  {formatDate(selectedRoster.startDate)} - {formatDate(selectedRoster.endDate)}
                </p>
              </div>

              {/* Officers */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Officers ({selectedRoster.officers.length})</h4>
                <div className="space-y-2">
                  {selectedRoster.officers.map((officer) => (
                    <div key={officer.id} className="bg-gray-50 p-2 rounded">
                      <span className="font-medium">{officer.name}</span>
                      <span className="text-gray-600 ml-2">({officer.badgeNumber})</span>
                      <span className="text-gray-500 ml-2">{officer.rank}</span>
                      {officer.unit && (
                        <span className="text-gray-500 ml-2">- {officer.unit}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Shifts */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Shifts ({selectedRoster.shifts.length})</h4>
                <div className="space-y-2">
                  {selectedRoster.shifts.map((shift) => (
                    <div key={shift.id} className="bg-gray-50 p-2 rounded">
                      <span className="font-medium">{shift.name}</span>
                      <span className="text-gray-600 ml-2">
                        {shift.startTime} - {shift.endTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assignments' && (
            <ShiftAssignmentComponent 
              roster={selectedRoster}
              onAssignmentUpdate={handleAssignmentUpdate}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView roster={selectedRoster} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {rosters.map((roster) => (
        <div 
          key={roster.id}
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{roster.name}</h3>
              <p className="text-gray-600 text-sm">
                {formatDate(roster.startDate)} - {formatDate(roster.endDate)}
              </p>
              <div className="mt-2 text-sm text-gray-500">
                <span className="mr-4">{roster.officers.length} Officers</span>
                <span className="mr-4">{roster.shifts.length} Shifts</span>
                <span>{roster.assignments?.length || 0} Assignments</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedRoster(roster)}
                className="text-blue-600 hover:text-blue-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button
                onClick={() => handleDeleteRoster(roster.id)}
                className="text-red-600 hover:text-red-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RosterList;
