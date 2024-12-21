/**
 * @file shiftRotation.ts
 * @description Utility functions for managing police shift rotation patterns.
 * Implements a complex rotation system with alternating day/night shifts
 * and work/break periods.
 */

/**
 * Configuration Constants
 * These define the fundamental structure of the shift rotation system
 */
// Base reference date for calculating rotations (first night shift)
const BASE_REFERENCE_DATE = new Date('2023-12-13');

// Complete rotation cycle length in days
const ROTATION_CYCLE_DAYS = 32; // 4 work periods of 4 days each + rest days

// Work period configuration
const SHIFT_DAYS = 4;  // Number of consecutive work days
const SHIFT_BREAK = 5; // Days off between first and second week of same shift type

/**
 * Type Definitions
 */
// Possible shift types
export type ShiftType = 'day' | 'night' | 'off';

// Week number in the rotation (1 or 2)
export type ShiftWeek = 1 | 2;

/**
 * Shift Information Interface
 * Contains complete information about a shift on a specific date
 */
interface ShiftInfo {
  isWorkDay: boolean;         // Whether it's a working day
  shiftType: ShiftType;       // Type of shift (day/night/off)
  weekNumber: ShiftWeek | null; // Week number in rotation (null if off)
}

/**
 * Calculate the number of days between two dates
 * 
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days between the dates
 */
const daysBetween = (date1: Date, date2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  const diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
  return diffDays;
};

/**
 * Get shift information for a specific date
 * 
 * The rotation pattern is:
 * - 4 nights on, 4 off
 * - 4 nights on, 4 off
 * - 4 days on, 4 off
 * - 4 days on, remaining days off to complete 32-day cycle
 * 
 * @param date - The date to check
 * @returns ShiftInfo object containing shift details
 * 
 * @example
 * const shiftInfo = getShiftInfo(new Date());
 * if (shiftInfo.isWorkDay && shiftInfo.shiftType === 'night') {
 *   console.log(`Night shift, Week ${shiftInfo.weekNumber}`);
 * }
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
  
  // Adjust for dates before reference date
  if (normalizedDate < normalizedBase) {
    daysSinceReference = ROTATION_CYCLE_DAYS - (daysSinceReference % ROTATION_CYCLE_DAYS);
  }

  // Calculate position in rotation cycle
  const dayInCycle = daysSinceReference % ROTATION_CYCLE_DAYS;

  // First week of night shifts (days 0-3)
  if (dayInCycle < SHIFT_DAYS) {
    return {
      isWorkDay: true,
      shiftType: 'night',
      weekNumber: 1
    };
  }
  
  // Second week of night shifts (days 8-11)
  if (dayInCycle >= SHIFT_DAYS + SHIFT_BREAK && dayInCycle < SHIFT_DAYS + SHIFT_BREAK + SHIFT_DAYS) {
    return {
      isWorkDay: true,
      shiftType: 'night',
      weekNumber: 2
    };
  }
  
  // First week of day shifts (days 16-19)
  if (dayInCycle >= 16 && dayInCycle < 16 + SHIFT_DAYS) {
    return {
      isWorkDay: true,
      shiftType: 'day',
      weekNumber: 1
    };
  }
  
  // Second week of day shifts (days 24-27)
  if (dayInCycle >= 24 && dayInCycle < 24 + SHIFT_DAYS) {
    return {
      isWorkDay: true,
      shiftType: 'day',
      weekNumber: 2
    };
  }

  // Off days (any day not matching above patterns)
  return {
    isWorkDay: false,
    shiftType: 'off',
    weekNumber: null
  };
};

/**
 * Find the next work day after a given date
 * 
 * @param date - Starting date to search from
 * @returns Date object representing the next work day
 * 
 * @example
 * const nextWorkDay = getNextWorkDay(new Date());
 * console.log('Next shift starts:', nextWorkDay);
 */
export const getNextWorkDay = (date: Date): Date => {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  
  // Keep incrementing date until we find a work day
  while (!getShiftInfo(nextDay).isWorkDay) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  
  return nextDay;
};

/**
 * Get all work days in a specified month
 * 
 * @param year - Year to check
 * @param month - Month to check (0-11)
 * @returns Array of dates that are work days
 * 
 * @example
 * const workDays = getWorkDaysInMonth(2023, 11); // December 2023
 * console.log(`Working ${workDays.length} days this month`);
 */
export const getWorkDaysInMonth = (year: number, month: number): Date[] => {
  const workDays: Date[] = [];
  const date = new Date(year, month, 1);
  
  // Check each day in the month
  while (date.getMonth() === month) {
    if (getShiftInfo(date).isWorkDay) {
      workDays.push(new Date(date));
    }
    date.setDate(date.getDate() + 1);
  }
  
  return workDays;
};
