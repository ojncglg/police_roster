import { useState } from 'react';
import type { Roster } from '../../types/roster';
import { getCalendarDays, formatTime, getMonthName, getShiftColor } from '../../utils/calendarHelpers';
import { exportToPDF, generateMonthlyReport } from '../../services/exportService';

interface PrintableCalendarProps {
  roster: Roster;
  month: Date;
  onClose: () => void;
}

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
              <h3 className="font-bold text-gray-800 mb-2">Shift Distribution</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(monthlyStats.shiftDistribution).map(([shift, count]) => (
                  <div key={shift} className="text-sm">
                    {shift}: {count} assignments
                  </div>
                ))}
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
                  `}
                >
                  <div className="font-bold text-gray-700 mb-2">
                    {day.date.getDate()}
                  </div>
                  <div className="space-y-1 text-sm">
                    {day.assignments.map((assignment, idx) => (
                      <div
                        key={idx}
                        className={`p-1 rounded ${getShiftColor(assignment.shift.name)}`}
                      >
                        <div className="font-medium">{assignment.officer.name}</div>
                        <div className="text-xs">
                          {assignment.shift.name} ({formatTime(assignment.shift.startTime)}-{formatTime(assignment.shift.endTime)})
                        </div>
                        <div className="text-xs italic">{assignment.position}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Officer Workload Summary */}
          <div className="mt-8 page-break-before">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Officer Workload Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(monthlyStats.officerWorkload).map(([officerName, count]) => (
                <div key={officerName} className="border rounded p-3">
                  <div className="font-bold text-gray-800">
                    {officerName}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total Assignments: {count}
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
