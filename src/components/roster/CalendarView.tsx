/**
 * @file CalendarView.tsx
 * @description Calendar component for visualizing and managing roster schedules.
 * Provides a monthly view of shifts, assignments, and training days with
 * interactive features for managing the roster.
 */

import { useState } from 'react';
import type { Roster } from '../../types/roster';
import type { Officer } from '../../types/officer';
import type { CalendarDay } from '../../utils/calendarHelpers';
import { getCalendarDays, formatTime, getMonthName, getShiftColor } from '../../utils/calendarHelpers';
import PrintableCalendar from './PrintableCalendar';
import { rosterService } from '../../services/rosterService';

interface CalendarViewProps {
  roster: Roster;  // The roster data to display
}

/**
 * Formats an officer's name for display
 * @param officer - Officer object
 * @returns Formatted name string
 */
const getOfficerDisplayName = (officer: Officer): string => {
  return `${officer.firstName} ${officer.lastName}`;
};

/**
 * CalendarView Component
 * 
 * Features:
 * - Monthly calendar grid with day/night shift visualization
 * - Training day management
 * - Shift assignment display
 * - Interactive day selection
 * - Printable view generation
 * - Navigation between months
 * 
 * @component
 */
const CalendarView = ({ roster }: CalendarViewProps) => {
  // State Management
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [showPrintView, setShowPrintView] = useState(false);
  const [showTrainingDayModal, setShowTrainingDayModal] = useState(false);
  const [trainingDayDescription, setTrainingDayDescription] = useState('');

  // Generate calendar data
  const calendarDays = getCalendarDays(currentDate, roster);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  /**
   * Navigation Handlers
   */
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(null);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        {/* Calendar Header - Month display and navigation controls */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between mb-4">
            {/* Left side controls */}
            <div className="flex items-center space-x-4">
              {/* Month and year display */}
              <h2 className="text-xl font-semibold text-gray-800">
                {getMonthName(currentDate)} {currentDate.getFullYear()}
              </h2>
              
              {/* Today button */}
              <button
                onClick={goToToday}
                className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
              >
                Today
              </button>

              {/* Add Training Day button */}
              <button
                onClick={() => setShowTrainingDayModal(true)}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <title>Add Training Day</title>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Training Day
              </button>
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
              {/* Print button */}
              <button
                onClick={() => setShowPrintView(true)}
                className="flex items-center px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                aria-label="Print Schedule"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <title>Print Schedule</title>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Schedule
              </button>

              {/* Training Day button (enabled when day is selected) */}
              <button
                onClick={() => {
                  if (selectedDay) {
                    setShowTrainingDayModal(true);
                  }
                }}
                className="flex items-center px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded ml-2"
                disabled={!selectedDay}
                aria-label="Add Training Day"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <title>Training Icon</title>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                Add Training Day
              </button>

              {/* Month navigation */}
              <div className="flex space-x-2">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-gray-100 rounded"
                  aria-label="Previous Month"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <title>Previous Month</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-gray-100 rounded"
                  aria-label="Next Month"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <title>Next Month</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Grid - Displays days with assignments and training days */}
        <div className="p-2">
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                onClick={() => setSelectedDay(day)}
                className={`
                  min-h-[120px] p-2 border rounded cursor-pointer
                  ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                  ${day.isToday ? 'border-blue-500' : 'border-gray-200'}
                  ${selectedDay?.date === day.date ? 'ring-2 ring-blue-500' : ''}
                  ${day.isTrainingDay ? 'bg-green-50' :
                    day.shiftInfo.isWorkDay ? 
                      day.shiftInfo.shiftType === 'night' ? 
                        'bg-indigo-50' : 
                        'bg-amber-50'
                      : ''}
                  hover:border-blue-300
                `}
              >
                {/* Day header with date and indicators */}
                <div className="flex justify-between items-start mb-2 relative">
                  <span
                    className={`
                      text-sm font-medium
                      ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                      ${day.isToday ? 'text-blue-600' : ''}
                    `}
                  >
                    {day.date.getDate()}
                    {day.shiftInfo.isWorkDay && (
                      <span className="ml-1 text-xs font-medium">
                        {day.shiftInfo.shiftType === 'night' ? '🌙' : '☀️'}
                        {day.shiftInfo.weekNumber && ` W${day.shiftInfo.weekNumber}`}
                        {day.isTrainingDay && ' 📚'}
                      </span>
                    )}
                  </span>
                  
                  {/* Shift count and type indicators */}
                  <div className="flex flex-col items-end">
                    {day.assignments.length > 0 && (
                      <span className="text-xs font-medium text-gray-500">
                        {day.assignments.length} shifts
                      </span>
                    )}
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
                </div>

                {/* Assignment list */}
                <div className="space-y-1">
                  {day.assignments.slice(0, 3).map((assignment, idx) => (
                    <div
                      key={idx}
                      className={`text-xs p-1 rounded truncate ${getShiftColor(assignment.shift.name)}`}
                    >
                      {getOfficerDisplayName(assignment.officer)} - {assignment.shift.name}
                    </div>
                  ))}
                  {day.assignments.length > 3 && (
                    <div className="text-xs text-gray-500 pl-1">
                      +{day.assignments.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Day Details Panel */}
        {selectedDay && (selectedDay.assignments.length > 0 || selectedDay.shiftInfo.isWorkDay || selectedDay.isTrainingDay) && (
          <div className="border-t p-4">
            {/* Selected day header */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedDay.date.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              
              {/* Shift and training indicators */}
              <div className="flex items-center space-x-2">
                {selectedDay.shiftInfo.isWorkDay && (
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedDay.shiftInfo.shiftType === 'night' 
                      ? 'bg-indigo-100 text-indigo-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedDay.shiftInfo.shiftType === 'night' ? '🌙 Night' : '☀️ Day'} Shift - Week {selectedDay.shiftInfo.weekNumber}
                  </div>
                )}
                {selectedDay.isTrainingDay && (
                  <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    📚 Training Day
                  </div>
                )}
              </div>
            </div>

            {/* Assignment and training details */}
            <div className="space-y-2">
              {selectedDay.assignments.length === 0 && selectedDay.shiftInfo.isWorkDay && (
                <div className="p-4 bg-gray-50 rounded text-gray-600 text-center">
                  No assignments yet for this {selectedDay.shiftInfo.shiftType} shift
                </div>
              )}
              {selectedDay.assignments.map((assignment, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div>
                    <span className="font-medium">{getOfficerDisplayName(assignment.officer)}</span>
                    <span className="text-gray-600 text-sm ml-2">({assignment.officer.badgeNumber})</span>
                  </div>
                  <div className="text-sm">
                    <span className={`px-2 py-1 rounded ${getShiftColor(assignment.shift.name)}`}>
                      {assignment.shift.name}
                    </span>
                    <span className="text-gray-600 ml-2">
                      {formatTime(assignment.shift.startTime)} - {formatTime(assignment.shift.endTime)}
                    </span>
                    <span className="text-gray-500 ml-2">
                      ({assignment.position})
                    </span>
                  </div>
                </div>
              ))}
              {selectedDay.isTrainingDay && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Training Details</h4>
                    <button
                      onClick={() => {
                        const dateString = selectedDay.date.toISOString().split('T')[0];
                        rosterService.removeTrainingDay(roster.id, dateString);
                      }}
                      className="px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                      Remove Training Day
                    </button>
                  </div>
                  {selectedDay.trainingDescription && (
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {selectedDay.trainingDescription}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Print View Modal */}
      {showPrintView && (
        <PrintableCalendar
          roster={roster}
          month={currentDate}
          onClose={() => setShowPrintView(false)}
        />
      )}

      {/* Training Day Modal */}
      {showTrainingDayModal && selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Add Training Day</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (optional)
              </label>
              <input
                type="text"
                value={trainingDayDescription}
                onChange={(e) => setTrainingDayDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter training description"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowTrainingDayModal(false);
                  setTrainingDayDescription('');
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const dateString = selectedDay.date.toISOString().split('T')[0];
                  rosterService.addTrainingDay(roster.id, {
                    date: dateString,
                    description: trainingDayDescription
                  });
                  setShowTrainingDayModal(false);
                  setTrainingDayDescription('');
                }}
                className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
              >
                Add Training Day
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarView;
