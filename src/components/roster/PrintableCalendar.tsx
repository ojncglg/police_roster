import { useState } from 'react';
import type { Roster } from '../../types/roster';
import type { Officer } from '../../types/officer';
import { getCalendarDays, formatTime, getMonthName, getShiftColor } from '../../utils/calendarHelpers';
import { exportToPDF, generateMonthlyReport } from '../../services/exportService';

interface PrintableCalendarProps {
  roster: Roster;
  month: Date;
  onClose: () => void;
}

const getOfficerDisplayName = (officer: Officer): string => {
  return `${officer.firstName} ${officer.lastName}`;
};

const getStatusColor = (status: Officer['status']): string => {
  switch (status) {
    case 'active': return 'text-green-600';
    case 'deployed': return 'text-amber-600';
    case 'fmla': return 'text-blue-600';
    case 'tdy': return 'text-purple-600';
    default: return 'text-red-600';
  }
};

const PrintableCalendar = ({ roster, month, onClose }: PrintableCalendarProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const calendarDays = getCalendarDays(month, roster);
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthlyStats = generateMonthlyReport(roster, month);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const success = await exportToPDF('printable-calendar', roster, month);
      if (success) {
        // Optional: Show success message
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-5 mx-auto p-5 w-[1100px] bg-white rounded-lg shadow-xl print:shadow-none">
        {/* Print Controls - Hidden during printing */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <h2 className="text-2xl font-bold text-gray-800">Print Preview</h2>
          <div className="space-x-4">
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${
                isExporting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </button>
            <button
              onClick={handlePrint}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Print Schedule
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div id="printable-calendar" className="print:m-0">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">NCCPD Roster Schedule</h1>
            <h2 className="text-xl text-gray-700">{roster.name}</h2>
            <p className="text-gray-600">
              {getMonthName(month)} {month.getFullYear()}
            </p>
          </div>

          {/* Monthly Statistics */}
          <div className="mb-8 grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-gray-800 mb-2">Monthly Overview</h3>
              <p>Total Assignments: {monthlyStats.totalAssignments}</p>
              <div className="mt-2">
                <h4 className="font-semibold">Position Coverage:</h4>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {Object.entries(monthlyStats.positionCoverage).map(([position, count]) => (
                    <div key={position} className="text-sm">
                      {position}: {count} shifts
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-gray-800 mb-2">Officer Status</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-green-600">
                  Active: {roster.officers.filter(o => o.status === 'active').length}
                </div>
                <div className="text-sm text-amber-600">
                  Deployed: {roster.officers.filter(o => o.status === 'deployed').length}
                </div>
                <div className="text-sm text-blue-600">
                  FMLA: {roster.officers.filter(o => o.status === 'fmla').length}
                </div>
                <div className="text-sm text-purple-600">
                  TDY: {roster.officers.filter(o => o.status === 'tdy').length}
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="mb-8">
            <div className="grid grid-cols-7 gap-1 mb-1">
              {weekDays.map(day => (
                <div key={day} className="text-center font-bold text-gray-700 border-b-2 border-gray-300 pb-1">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`
                    min-h-[150px] p-2 border border-gray-300
                    ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                    ${day.shiftInfo.isWorkDay ? 
                      day.shiftInfo.shiftType === 'night' ? 
                        'bg-indigo-50 print:bg-indigo-50' : 
                        'bg-amber-50 print:bg-amber-50'
                      : ''}
                  `}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-gray-700">
                      {day.date.getDate()}
                      {day.shiftInfo.isWorkDay && (
                        <span className="ml-1 text-xs font-medium">
                          {day.shiftInfo.shiftType === 'night' ? '🌙' : '☀️'}
                          {day.shiftInfo.weekNumber && ` W${day.shiftInfo.weekNumber}`}
                        </span>
                      )}
                    </div>
                    {day.shiftInfo.isWorkDay && (
                      <span className={`text-xs font-medium ${
                        day.shiftInfo.shiftType === 'night' ? 
                          'text-indigo-600' : 
                          'text-amber-600'
                      }`}>
                        {day.shiftInfo.shiftType === 'night' ? 'Night' : 'Day'}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-sm">
                    {day.assignments.map((assignment, idx) => (
                      <div
                        key={idx}
                        className={`p-1 rounded ${getShiftColor(assignment.shift.name)}`}
                      >
                        <div className="font-medium">
                          {getOfficerDisplayName(assignment.officer)}
                          {assignment.officer.specialAssignment && (
                            <span className="ml-1 text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                              {assignment.officer.specialAssignment}
                            </span>
                          )}
                        </div>
                        <div className="text-xs">
                          {assignment.shift.name} ({formatTime(assignment.shift.startTime)}-{formatTime(assignment.shift.endTime)})
                        </div>
                        <div className="text-xs italic">{assignment.position}</div>
                        <div className={`text-xs ${getStatusColor(assignment.officer.status)}`}>
                          ({assignment.officer.status})
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shift Rotation Summary */}
          <div className="mt-8 mb-8 page-break-before">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Shift Rotation Pattern</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded p-4">
                <h4 className="font-bold text-gray-800 mb-2">Night Shifts</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-indigo-600 mr-2">🌙</span>
                    <span>Week 1: 4 consecutive nights</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-indigo-600 mr-2">🌙</span>
                    <span>Week 2: 4 consecutive nights (after 5 days break)</span>
                  </div>
                </div>
              </div>
              <div className="border rounded p-4">
                <h4 className="font-bold text-gray-800 mb-2">Day Shifts</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-amber-600 mr-2">☀️</span>
                    <span>Week 1: 4 consecutive days</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-amber-600 mr-2">☀️</span>
                    <span>Week 2: 4 consecutive days (after 5 days break)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Officer Workload Summary */}
          <div className="mt-8 page-break-before">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Officer Workload Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              {roster.officers.map((officer) => (
                <div key={officer.id} className="border rounded p-3">
                  <div className="font-bold text-gray-800">
                    {getOfficerDisplayName(officer)}
                    {officer.specialAssignment && (
                      <span className="ml-2 text-sm bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                        {officer.specialAssignment}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Badge: {officer.badgeNumber}
                    <span className={`ml-2 ${getStatusColor(officer.status)}`}>
                      ({officer.status})
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Total Assignments: {monthlyStats.officerWorkload[officer.id] || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>Generated on {new Date().toLocaleDateString()}</p>
            <p>NCCPD Roster Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableCalendar;
