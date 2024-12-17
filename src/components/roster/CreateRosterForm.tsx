import { useState } from 'react';
import type { Officer, Shift } from '../../types/roster';
import { rosterService } from '../../services/rosterService';

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
  const [newOfficer, setNewOfficer] = useState({
    badgeNumber: '',
    name: '',
    rank: '',
    unit: ''
  });

  // Shift form states
  const [newShift, setNewShift] = useState({
    name: '',
    startTime: '',
    endTime: ''
  });

  const handleAddOfficer = () => {
    if (newOfficer.badgeNumber && newOfficer.name) {
      setOfficers([
        ...officers,
        {
          id: Date.now().toString(),
          ...newOfficer
        }
      ]);
      setNewOfficer({ badgeNumber: '', name: '', rank: '', unit: '' });
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
        assignments: []
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
                    Name
                  </label>
                  <input
                    type="text"
                    value={newOfficer.name}
                    onChange={(e) => setNewOfficer({...newOfficer, name: e.target.value})}
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
                    <option value="Officer">Officer</option>
                    <option value="Sergeant">Sergeant</option>
                    <option value="Lieutenant">Lieutenant</option>
                    <option value="Captain">Captain</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={newOfficer.unit}
                    onChange={(e) => setNewOfficer({...newOfficer, unit: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
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
                  <span className="font-bold">{officer.badgeNumber}</span> - {officer.name}
                  <span className="ml-2 text-gray-600">({officer.rank})</span>
                </div>
                <span className="text-gray-600">{officer.unit}</span>
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
