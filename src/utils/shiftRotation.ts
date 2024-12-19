/**
 * Utility functions for handling shift rotation patterns
 */

// The base reference date for the rotation (December 13, 2023 - first night shift)
const BASE_REFERENCE_DATE = new Date('2023-12-13');
const ROTATION_CYCLE_DAYS = 32; // Complete cycle repeats every 32 days
const SHIFT_DAYS = 4; // Number of consecutive work days
const SHIFT_BREAK = 5; // Days between first and second week

export type ShiftType = 'day' | 'night' | 'off';
export type ShiftWeek = 1 | 2;

interface ShiftInfo {
  isWorkDay: boolean;
  shiftType: ShiftType;
  weekNumber: ShiftWeek | null;
}

/**
 * Calculate the number of days between two dates
 */
const daysBetween = (date1: Date, date2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
  return diffDays;
};

/**
 * Get shift information for a specific date
 * @param date The date to check
 * @returns Object containing shift information
 */
export const getShiftInfo = (date: Date): ShiftInfo => {
  // Normalize dates to start of day to avoid time zone issues
  const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const normalizedBase = new Date(
    BASE_REFERENCE_DATE.getFullYear(),
    BASE_REFERENCE_DATE.getMonth(),
    BASE_REFERENCE_DATE.getDate()
  );

  // Calculate days since reference date
  let daysSinceReference = daysBetween(normalizedDate, normalizedBase);
  
  // Adjust for dates before reference
  if (normalizedDate < normalizedBase) {
    daysSinceReference = ROTATION_CYCLE_DAYS - (daysSinceReference % ROTATION_CYCLE_DAYS);
  }

  // Get position in the rotation cycle
  const dayInCycle = daysSinceReference % ROTATION_CYCLE_DAYS;

  // First week of nights (days 0-3)
  if (dayInCycle < SHIFT_DAYS) {
    return {
      isWorkDay: true,
      shiftType: 'night',
      weekNumber: 1
    };
  }
  
  // Second week of nights (days 8-11)
  if (dayInCycle >= SHIFT_DAYS + SHIFT_BREAK && dayInCycle < SHIFT_DAYS + SHIFT_BREAK + SHIFT_DAYS) {
    return {
      isWorkDay: true,
      shiftType: 'night',
      weekNumber: 2
    };
  }
  
  // First week of days (days 16-19)
  if (dayInCycle >= 16 && dayInCycle < 16 + SHIFT_DAYS) {
    return {
      isWorkDay: true,
      shiftType: 'day',
      weekNumber: 1
    };
  }
  
  // Second week of days (days 24-27)
  if (dayInCycle >= 24 && dayInCycle < 24 + SHIFT_DAYS) {
    return {
      isWorkDay: true,
      shiftType: 'day',
      weekNumber: 2
    };
  }

  // Off days
  return {
    isWorkDay: false,
    shiftType: 'off',
    weekNumber: null
  };
};

/**
 * Get the next work day for a given date
 * @param date The reference date
 * @returns Date of the next work day
 */
export const getNextWorkDay = (date: Date): Date => {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  
  while (!getShiftInfo(nextDay).isWorkDay) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  
  return nextDay;
};

/**
 * Get all work days in a given month
 * @param year The year
 * @param month The month (0-11)
 * @returns Array of dates that are work days
 */
export const getWorkDaysInMonth = (year: number, month: number): Date[] => {
  const workDays: Date[] = [];
  const date = new Date(year, month, 1);
  
  while (date.getMonth() === month) {
    if (getShiftInfo(date).isWorkDay) {
      workDays.push(new Date(date));
    }
    date.setDate(date.getDate() + 1);
  }
  
  return workDays;
};
