import { useState, useEffect } from 'react';
import type { Officer } from '../../types/officer';
import type { Shift } from '../../types/roster';
import { RANKS, SPECIAL_TEAMS, isCommandRank } from '../../types/officer';
import { rosterService } from '../../services/rosterService';

type OfficerStatus = 'active' | 'deployed' | 'fmla' | 'tdy';

interface NewOfficer extends Omit<Officer, 'id' | 'status'> {
  status: OfficerStatus;
}

const CreateRosterForm = () => {
  const [rosterName, setRosterName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [showOfficerForm, setShowOfficerForm] = useState(false);
  const [showShiftForm, setShowShiftForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Officer form states
  const [newOfficer, setNewOfficer] = useState<NewOfficer>({
    firstName: '',
    lastName: '',
    badgeNumber: '',
    rank: '',
    zone: '',
    sector: '',
    isOnDesk: false,
    specialAssignment: '',
    email: '',
    phone: '',
    status: 'active',
    notes: '',
    specialAssignments: [],
    isActive: true
  });

  // Shift form states
  const [newShift, setNewShift] = useState({
    name: '',
    startTime: '',
    endTime: ''
  });

  // Reset isOnDesk when rank changes
  useEffect(() => {
    if (!isCommandRank(newOfficer.rank)) {
      setNewOfficer(prev => ({ ...prev, isOnDesk: false }));
    }
  }, [newOfficer.rank]);

  const handleAddOfficer = () => {
    if (newOfficer.badgeNumber && newOfficer.firstName && newOfficer.lastName) {
      // Ensure isOnDesk is set based on the rank
      const officerToAdd = {
        id: Date.now().toString(),
        ...newOfficer,
        isOnDesk: isCommandRank(newOfficer.rank) ? newOfficer.isOnDesk : false,
      };
      
      setOfficers([...officers, officerToAdd]);
      
      // Reset form
      setNewOfficer({
        firstName: '',
        lastName: '',
        badgeNumber: '',
        rank: '',
        zone: '',
        sector: '',
        isOnDesk: false,
        specialAssignment: '',
        email: '',
        phone: '',
        status: 'active',
        notes: '',
        specialAssignments: [],
        isActive: true
      });
      setShowOfficerForm(false);
    }
  };

  const handleAddShift = () => {
    if (newShift.name && newShift.startTime && newShift.endTime) {
      setShifts([
        ...shifts,
        {
          id: Date.now().toString(),
          ...newShift
        }
      ]);
      setNewShift({ name: '', startTime: '', endTime: '' });
      setShowShiftForm(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Basic validation
      if (!rosterName || !startDate || !endDate) {
        setErrorMessage('Please fill in all required fields');
        return;
      }

      if (officers.length === 0) {
        setErrorMessage('Please add at least one officer');
        return;
      }

      if (shifts.length === 0) {
        setErrorMessage('Please add at least one shift');
        return;
      }

      // Create new roster
      rosterService.createRoster({
        name: rosterName,
        startDate,
        endDate,
        officers,
        shifts,
        assignments: [],
        trainingDays: []
      });

      // Show success message
      setSuccessMessage('Roster created successfully!');
      
      // Reset form
      setRosterName('');
      setStartDate('');
      setEndDate('');
      setOfficers([]);
      setShifts([]);
      setErrorMessage('');

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (error) {
      setErrorMessage('An error occurred while creating the roster');
      console.error('Error creating roster:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Roster Information */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Basic Information</h3>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Roster Name
            </label>
            <input
              type="text"
              value={rosterName}
              onChange={(e) => setRosterName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
          </div>
        </div>

        {/* Officers Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Officers</h3>
            <button
              type="button"
              onClick={() => setShowOfficerForm(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Officer
            </button>
          </div>
          
          {showOfficerForm && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Badge Number
                  </label>
                  <input
                    type="text"
                    value={newOfficer.badgeNumber}
                    onChange={(e) => setNewOfficer({...newOfficer, badgeNumber: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={newOfficer.firstName}
                    onChange={(e) => setNewOfficer({...newOfficer, firstName: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={newOfficer.lastName}
                    onChange={(e) => setNewOfficer({...newOfficer, lastName: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Rank
                  </label>
                  <select
                    value={newOfficer.rank}
                    onChange={(e) => setNewOfficer({...newOfficer, rank: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Select Rank</option>
                    {RANKS.map((rank) => (
                      <option key={rank} value={rank}>{rank}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Special Assignment
                  </label>
                  <select
                    value={newOfficer.specialAssignment}
                    onChange={(e) => setNewOfficer({...newOfficer, specialAssignment: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Select Special Assignment</option>
                    {Object.entries(SPECIAL_TEAMS).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>
                {isCommandRank(newOfficer.rank) && (
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newOfficer.isOnDesk}
                        onChange={(e) => setNewOfficer({...newOfficer, isOnDesk: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Assigned to Desk Duty</span>
                    </label>
                  </div>
                )}
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Status
                  </label>
                  <select
                    value={newOfficer.status}
                    onChange={(e) => setNewOfficer({...newOfficer, status: e.target.value as OfficerStatus})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="active">Active</option>
                    <option value="deployed">Deployed</option>
                    <option value="fmla">FMLA</option>
                    <option value="tdy">TDY</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowOfficerForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddOfficer}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Officers List */}
          <div className="mt-4">
            {officers.map((officer) => (
              <div key={officer.id} className="bg-gray-50 p-3 rounded-lg mb-2 flex justify-between items-center">
                <div>
                  <span className="font-bold">{officer.badgeNumber}</span> - {officer.firstName} {officer.lastName}
                  <span className="ml-2 text-gray-600">({officer.rank})</span>
                  {isCommandRank(officer.rank) && (
                    <span className="ml-2 text-gray-600">
                      {officer.isOnDesk ? '- On Desk' : '- On Patrol'}
                    </span>
                  )}
                  {officer.specialAssignment && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                      {SPECIAL_TEAMS[officer.specialAssignment as keyof typeof SPECIAL_TEAMS] || officer.specialAssignment}
                    </span>
                  )}
                </div>
                <span className={`text-sm ${
                  officer.status === 'active' ? 'text-green-600' :
                  officer.status === 'deployed' ? 'text-amber-600' :
                  officer.status === 'fmla' ? 'text-blue-600' :
                  officer.status === 'tdy' ? 'text-purple-600' :
                  'text-red-600'
                }`}>
                  {officer.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shifts Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Shifts</h3>
            <button
              type="button"
              onClick={() => setShowShiftForm(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Shift
            </button>
          </div>

          {showShiftForm && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Shift Name
                  </label>
                  <input
                    type="text"
                    value={newShift.name}
                    onChange={(e) => setNewShift({...newShift, name: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newShift.startTime}
                    onChange={(e) => setNewShift({...newShift, startTime: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newShift.endTime}
                    onChange={(e) => setNewShift({...newShift, endTime: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowShiftForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddShift}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Shifts List */}
          <div className="mt-4">
            {shifts.map((shift) => (
              <div key={shift.id} className="bg-gray-50 p-3 rounded-lg mb-2 flex justify-between items-center">
                <span className="font-bold">{shift.name}</span>
                <span className="text-gray-600">
                  {shift.startTime} - {shift.endTime}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Roster
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRosterForm;
