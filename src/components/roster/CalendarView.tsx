import { useState } from 'react';
import { Roster } from '../../types/roster';
import { CalendarDay, getCalendarDays, formatTime, getMonthName, getShiftColor } from '../../utils/calendarHelpers';
import PrintableCalendar from './PrintableCalendar';

interface CalendarViewProps {
  roster: Roster;
}

const CalendarView = ({ roster }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [showPrintView, setShowPrintView] = useState(false);

  const calendarDays = getCalendarDays(currentDate, roster);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
        {/* Calendar Header */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {getMonthName(currentDate)} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={goToToday}
                className="ml-4 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
              >
                Today
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPrintView(true)}
                className="flex items-center px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Schedule
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Week days header */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Grid */}
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
                  hover:border-blue-300
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`
                      text-sm font-medium
                      ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                      ${day.isToday ? 'text-blue-600' : ''}
                    `}
                  >
                    {day.date.getDate()}
                  </span>
                  {day.assignments.length > 0 && (
                    <span className="text-xs font-medium text-gray-500">
                      {day.assignments.length} shifts
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  {day.assignments.slice(0, 3).map((assignment, idx) => (
                    <div
                      key={idx}
                      className={`text-xs p-1 rounded truncate ${getShiftColor(assignment.shift.name)}`}
                    >
                      {assignment.officer.name} - {assignment.shift.name}
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

        {/* Selected Day Details */}
        {selectedDay && selectedDay.assignments.length > 0 && (
          <div className="border-t p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {selectedDay.date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </h3>
            <div className="space-y-2">
              {selectedDay.assignments.map((assignment, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div>
                    <span className="font-medium">{assignment.officer.name}</span>
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
    </>
  );
};

export default CalendarView;
