/**
 * @file calendarHelpers.ts
 * @description Utility functions for calendar operations, including date manipulation,
 * calendar grid generation, and visual formatting for the roster calendar view.
 */

import type { Roster, ShiftAssignment, Officer, Shift } from '../types/roster';
import type { ShiftType } from './shiftRotation';
import { getShiftInfo } from './shiftRotation';

/**
 * CalendarDay Interface
 * Represents a single day in the calendar view with all associated data
 */
export interface CalendarDay {
  date: Date;                    // The date object for this calendar day
  assignments: (ShiftAssignment & {
    officer: Officer;            // Expanded officer data for the assignment
    shift: Shift;               // Expanded shift data for the assignment
  })[];                         // List of assignments for this day
  isCurrentMonth: boolean;      // Whether this day belongs to the displayed month
  isToday: boolean;             // Whether this day is today
  shiftInfo: {
    isWorkDay: boolean;         // Whether this is a scheduled work day
    shiftType: ShiftType;       // Type of shift scheduled
    weekNumber: 1 | 2 | null;   // Week number in the rotation
  };
  isTrainingDay?: boolean;      // Whether this is a training day
  trainingDescription?: string; // Optional training description
}

/**
 * Generates calendar days for a given month
 * 
 * @param date - Date object representing the month to generate calendar for
 * @param roster - Roster data containing assignments and training days
 * @returns Array of CalendarDay objects representing a 6-week calendar grid
 * 
 * The function:
 * 1. Determines the first day to show in the calendar
 * 2. Generates 42 days (6 weeks) for consistent calendar size
 * 3. Matches assignments and training days to each calendar day
 * 4. Includes days from previous/next months as needed
 */
export const getCalendarDays = (date: Date, roster: Roster): CalendarDay[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  // Get the first day of the month
  const firstDayOfMonth = new Date(year, month, 1);
  
  // Get the day of the week of the first day (0-6, 0 = Sunday)
  const firstDayWeekday = firstDayOfMonth.getDay();
  
  // Calculate the first day to show (including days from previous month)
  const calendarStart = new Date(firstDayOfMonth);
  calendarStart.setDate(calendarStart.getDate() - firstDayWeekday);
  
  const days: CalendarDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Generate 42 days (6 weeks) for consistent calendar size
  for (let i = 0; i < 42; i++) {
    const currentDate = new Date(calendarStart);
    currentDate.setDate(currentDate.getDate() + i);
    
    // Get ISO date string for comparison
    const dateString = currentDate.toISOString().split('T')[0];
    
    // Find and expand assignments for this day
    const dayAssignments = (roster.assignments || [])
      .filter(assignment => assignment.date === dateString)
      .map(assignment => ({
        ...assignment,
        officer: roster.officers.find(o => o.id === assignment.officerId)!,
        shift: roster.shifts.find(s => s.id === assignment.shiftId)!
      }));

    // Check for training day
    const trainingDay = roster.trainingDays?.find(td => td.date === dateString);
    
    days.push({
      date: currentDate,
      assignments: dayAssignments,
      isCurrentMonth: currentDate.getMonth() === month,
      isToday: currentDate.getTime() === today.getTime(),
      shiftInfo: getShiftInfo(currentDate),
      isTrainingDay: !!trainingDay,
      trainingDescription: trainingDay?.description
    });
  }
  
  return days;
};

/**
 * Formats time string to 12-hour format
 * 
 * @param timeString - Time string in 24-hour format (HH:mm)
 * @returns Formatted time string in 12-hour format with AM/PM
 * 
 * @example
 * formatTime("13:00") // Returns "1PM"
 * formatTime("09:30") // Returns "9:30AM"
 */
export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  const hour = Number.parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}${minutes === '00' ? '' : `:${minutes}`}${ampm}`;
};

/**
 * Gets the full month name for a date
 * 
 * @param date - Date object
 * @returns Full month name (e.g., "January")
 */
export const getMonthName = (date: Date): string => {
  return date.toLocaleString('default', { month: 'long' });
};

/**
 * Generates a consistent color scheme for shifts
 * 
 * @param shiftName - Name of the shift
 * @returns Tailwind CSS classes for background and text colors
 * 
 * Uses the shift name to deterministically generate a color
 * combination, ensuring the same shift always gets the same color
 */
export const getShiftColor = (shiftName: string): string => {
  // Predefined color combinations using Tailwind classes
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-yellow-100 text-yellow-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800'
  ];
  
  // Generate consistent index based on shift name
  const index = shiftName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};
