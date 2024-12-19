import { useState } from 'react';
import type { Roster, ShiftAssignment } from '../../types/roster';
import { rosterService } from '../../services/rosterService';

interface ShiftAssignmentProps {
  roster: Roster;
  onAssignmentUpdate: () => void;
}

const getOfficerDisplayName = (officer: Roster['officers'][0]): string => {
  return `${officer.firstName} ${officer.lastName}`;
};

const ShiftAssignmentComponent = ({ roster, onAssignmentUpdate }: ShiftAssignmentProps) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShift, setSelectedShift] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [assignments, setAssignments] = useState<ShiftAssignment[]>(roster.assignments || []);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Generate array of dates between roster start and end date
  const getDatesInRange = () => {
    const dates: string[] = [];
    const start = new Date(roster.startDate);
    const end = new Date(roster.endDate);
    
    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const positions = [
    'Patrol',
    'Supervisor',
    'Dispatch',
    'Traffic',
    'Investigation',
    'Special Unit'
  ];

  const handleAssignment = () => {
    if (!selectedDate || !selectedShift || !selectedOfficer || !selectedPosition) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    // Check if officer is already assigned to a shift on the selected date
    const existingAssignment = assignments.find(
      a => a.officerId === selectedOfficer && a.date === selectedDate
    );

    if (existingAssignment) {
      setErrorMessage('Officer is already assigned to a shift on this date');
      return;
    }

    // Check if officer is on leave or inactive
    const officer = roster.officers.find(o => o.id === selectedOfficer);
    if (officer && (officer.status === 'leave' || officer.status === 'inactive')) {
      setErrorMessage(`Cannot assign officer who is ${officer.status}`);
      return;
    }

    try {
      const newAssignment: ShiftAssignment = {
        shiftId: selectedShift,
        officerId: selectedOfficer,
        date: selectedDate,
        position: selectedPosition
      };

      // Update roster with new assignment
      const updatedRoster = {
        ...roster,
        assignments: [...assignments, newAssignment]
      };

      rosterService.updateRoster(updatedRoster);
      setAssignments(updatedRoster.assignments);
      onAssignmentUpdate();

      // Show success message
      setSuccessMessage('Assignment created successfully');
      setErrorMessage('');

      // Reset form
      setSelectedDate('');
      setSelectedShift('');
      setSelectedOfficer('');
      setSelectedPosition('');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setErrorMessage('Error creating assignment');
      console.error('Error:', error);
    }
  };

  const removeAssignment = (date: string, officerId: string) => {
    try {
      const updatedAssignments = assignments.filter(
        a => !(a.date === date && a.officerId === officerId)
      );

      const updatedRoster = {
        ...roster,
        assignments: updatedAssignments
      };

      rosterService.updateRoster(updatedRoster);
      setAssignments(updatedAssignments);
      onAssignmentUpdate();
    } catch (error) {
      setErrorMessage('Error removing assignment');
      console.error('Error:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getOfficerById = (officerId: string) => {
    return roster.officers.find(o => o.id === officerId);
  };

  const getShiftName = (shiftId: string) => {
    return roster.shifts.find(s => s.id === shiftId)?.name || 'Unknown Shift';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'leave': return 'text-amber-600';
      case 'training': return 'text-blue-600';
      default: return 'text-red-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Assignment Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Create New Assignment</h3>
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Date
            </label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select Date</option>
              {getDatesInRange().map((date) => (
                <option key={date} value={date}>
                  {formatDate(date)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Shift
            </label>
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select Shift</option>
              {roster.shifts.map((shift) => (
                <option key={shift.id} value={shift.id}>
                  {shift.name} ({shift.startTime} - {shift.endTime})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Officer
            </label>
            <select
              value={selectedOfficer}
              onChange={(e) => setSelectedOfficer(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select Officer</option>
              {roster.officers
                .filter(officer => officer.status === 'active' || officer.status === 'training')
                .map((officer) => (
                  <option key={officer.id} value={officer.id}>
                    {getOfficerDisplayName(officer)} ({officer.badgeNumber})
                  </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Position
            </label>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select Position</option>
              {positions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={handleAssignment}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Assignment
          </button>
        </div>
      </div>

      {/* Assignments List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Assignments</h3>
        
        {assignments.length === 0 ? (
          <p className="text-gray-600">No assignments created yet.</p>
        ) : (
          <div className="space-y-2">
            {getDatesInRange().map((date) => {
              const dateAssignments = assignments.filter(a => a.date === date);
              if (dateAssignments.length === 0) return null;

              return (
                <div key={date} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">{formatDate(date)}</h4>
                  <div className="space-y-2">
                    {dateAssignments.map((assignment, index) => {
                      const officer = getOfficerById(assignment.officerId);
                      if (!officer) return null;

                      return (
                        <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                          <div>
                            <span className="font-medium">{getOfficerDisplayName(officer)}</span>
                            {officer.specialAssignment && (
                              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                                {officer.specialAssignment}
                              </span>
                            )}
                            <span className="text-gray-600 mx-2">→</span>
                            <span>{getShiftName(assignment.shiftId)}</span>
                            <span className="text-gray-600 ml-2">({assignment.position})</span>
                            <span className={`ml-2 text-sm ${getStatusColor(officer.status)}`}>
                              ({officer.status})
                            </span>
                          </div>
                          <button
                            onClick={() => removeAssignment(assignment.date, assignment.officerId)}
                            className="text-red-600 hover:text-red-800"
                            aria-label="Remove Assignment"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-labelledby="remove-assignment-title">
                              <title id="remove-assignment-title">Remove Assignment</title>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftAssignmentComponent;
