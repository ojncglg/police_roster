/**
 * @file roster.ts
 * @description Type definitions for roster management and shift assignments.
 * These types define the core data structures for managing police officer schedules,
 * shifts, and training days.
 */

import type { Officer as FullOfficer } from './officer';

/**
 * Shift Interface
 * Represents a defined work period in the roster
 * 
 * @example
 * {
 *   id: "shift1",
 *   name: "Day Shift",
 *   startTime: "07:00",
 *   endTime: "19:00"
 * }
 */
export interface Shift {
  id: string;      // Unique shift identifier
  name: string;    // Display name of the shift (e.g., "Day Shift", "Night Shift")
  startTime: string; // Start time in 24-hour format (HH:mm)
  endTime: string;   // End time in 24-hour format (HH:mm)
}

/**
 * Re-export Officer type from officer.ts
 * Ensures consistent officer data structure throughout the roster system
 */
export type Officer = FullOfficer;

/**
 * ShiftAssignment Interface
 * Represents the assignment of an officer to a specific shift on a specific date
 * 
 * @example
 * {
 *   shiftId: "shift1",
 *   officerId: "officer123",
 *   date: "2023-12-25",
 *   position: "Patrol"
 * }
 */
export interface ShiftAssignment {
  shiftId: string;    // Reference to the assigned shift
  officerId: string;  // Reference to the assigned officer
  date: string;       // Date of the assignment (YYYY-MM-DD)
  position: string;   // Officer's position/role during the shift
}

/**
 * TrainingDay Interface
 * Represents a scheduled training event in the roster
 * 
 * @example
 * {
 *   date: "2023-12-26",
 *   description: "Annual Firearms Qualification"
 * }
 */
export interface TrainingDay {
  date: string;         // Date of the training (YYYY-MM-DD)
  description?: string; // Optional description of the training event
}

/**
 * Roster Interface
 * Represents a complete roster period with all related data
 * 
 * A roster is the main organizational unit for scheduling, containing:
 * - Basic roster information (name, dates)
 * - Available shifts
 * - Assigned officers
 * - Shift assignments
 * - Training days
 * 
 * @example
 * {
 *   id: "roster2023Q4",
 *   name: "Q4 2023 Roster",
 *   startDate: "2023-10-01",
 *   endDate: "2023-12-31",
 *   shifts: [...],
 *   officers: [...],
 *   assignments: [...],
 *   trainingDays: [...]
 * }
 */
export interface Roster {
  id: string;           // Unique roster identifier
  name: string;         // Descriptive name of the roster period
  startDate: string;    // Start date of the roster period (YYYY-MM-DD)
  endDate: string;      // End date of the roster period (YYYY-MM-DD)
  shifts: Shift[];      // List of available shifts in this roster
  officers: Officer[];  // List of officers included in this roster
  assignments: ShiftAssignment[]; // List of all shift assignments
  trainingDays: TrainingDay[];   // List of scheduled training days
}
