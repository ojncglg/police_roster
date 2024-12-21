import type { Shift, ShiftAssignment, Roster } from '../types/roster';
import type { Officer } from '../types/officer';
import { isCommandRank } from '../types/officer';

export interface ValidationError {
  field: string;
  message: string;
}

interface ValidationRule<T> {
  field: keyof T & string;
  validate: (value: unknown) => boolean;
  message: string;
}

// Validation Helper Functions
const createError = (field: string, message: string): ValidationError => ({
  field,
  message,
});

const validateRequired = (value: unknown): boolean => {
  return value !== undefined && value !== null && value !== '';
};

const validateLength = (value: unknown, min: number): boolean => {
  return typeof value === 'string' && value.length >= min;
};

const validatePattern = (value: unknown, pattern: RegExp): boolean => {
  return typeof value === 'string' && pattern.test(value);
};

const validateDateRange = (startDate: Date, endDate: Date): boolean => {
  return endDate > startDate;
};

const validateTimeRange = (startTime: string, endTime: string): boolean => {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  return end > start;
};

function validateRules<T>(
  data: Partial<T>,
  rules: ValidationRule<T>[]
): ValidationError[] {
  return rules
    .filter(rule => !rule.validate(data[rule.field]))
    .map(rule => createError(rule.field, rule.message));
}

// Helper functions for shift assignments
const getConsecutiveWorkDays = (
  officerId: string,
  date: string,
  assignments: ShiftAssignment[]
): number => {
  const assignmentDate = new Date(date);
  const consecutiveDays = 1;

  const checkDays = (increment: number): number => {
    const currentDate = new Date(assignmentDate);
    let count = 0;
    
    while (true) {
      currentDate.setDate(currentDate.getDate() + increment);
      const hasAssignment = assignments.some(a => 
        a.officerId === officerId && 
        new Date(a.date).getTime() === currentDate.getTime()
      );
      if (!hasAssignment) break;
      count++;
    }
    return count;
  };

  return checkDays(-1) + consecutiveDays + checkDays(1);
};

const calculateRestHours = (endTime: string, startTime: string): number => {
  const [endHour, endMinute] = endTime.split(':').map(Number);
  const [startHour, startMinute] = startTime.split(':').map(Number);
  
  let hours = startHour - endHour;
  if (hours < 0) hours += 24;
  
  let minutes = startMinute - endMinute;
  if (minutes < 0) {
    hours -= 1;
    minutes += 60;
  }
  
  return hours + minutes / 60;
};

// Validation functions
export const validateOfficer = (officer: Partial<Officer>): ValidationError[] => {
  const rules: ValidationRule<Officer>[] = [
    {
      field: 'badgeNumber',
      validate: (value) => validatePattern(value as string, /^\d{1,6}$/),
      message: 'Badge number must be 1-6 digits',
    },
    {
      field: 'firstName',
      validate: (value) => validateLength(value as string, 2),
      message: 'First name must be at least 2 characters',
    },
    {
      field: 'lastName',
      validate: (value) => validateLength(value as string, 2),
      message: 'Last name must be at least 2 characters',
    },
    {
      field: 'rank',
      validate: validateRequired,
      message: 'Rank is required',
    },
    {
      field: 'status',
      validate: validateRequired,
      message: 'Status is required',
    }
  ];

  // Add desk validation for command ranks
  if (officer.rank && isCommandRank(officer.rank)) {
    rules.push({
      field: 'isOnDesk',
      validate: validateRequired,
      message: 'Desk duty assignment is required for command ranks',
    });
  }

  return validateRules(officer, rules);
};

export const validateShift = (shift: Partial<Shift>): ValidationError[] => {
  const baseRules: ValidationRule<Shift>[] = [
    {
      field: 'name',
      validate: validateRequired,
      message: 'Shift name is required',
    },
    {
      field: 'startTime',
      validate: validateRequired,
      message: 'Start time is required',
    },
    {
      field: 'endTime',
      validate: validateRequired,
      message: 'End time is required',
    },
  ];

  const errors = validateRules(shift, baseRules);

  if (shift.startTime && shift.endTime && !validateTimeRange(shift.startTime, shift.endTime)) {
    errors.push(createError('endTime', 'End time must be after start time'));
  }

  return errors;
};

export const validateRoster = (roster: Partial<Roster>): ValidationError[] => {
  const baseRules: ValidationRule<Roster>[] = [
    {
      field: 'name',
      validate: validateRequired,
      message: 'Roster name is required',
    },
    {
      field: 'startDate',
      validate: validateRequired,
      message: 'Start date is required',
    },
    {
      field: 'endDate',
      validate: validateRequired,
      message: 'End date is required',
    },
  ];

  const errors = validateRules(roster, baseRules);

  if (roster.startDate && roster.endDate) {
    const start = new Date(roster.startDate);
    const end = new Date(roster.endDate);
    if (!validateDateRange(start, end)) {
      errors.push(createError('endDate', 'End date must be after start date'));
    }
  }

  return errors;
};

export const validateShiftAssignment = (
  assignment: Partial<ShiftAssignment>,
  roster: Roster,
  existingAssignments: ShiftAssignment[]
): ValidationError[] => {
  const baseRules: ValidationRule<ShiftAssignment>[] = [
    {
      field: 'date',
      validate: validateRequired,
      message: 'Date is required',
    },
    {
      field: 'shiftId',
      validate: validateRequired,
      message: 'Shift selection is required',
    },
    {
      field: 'officerId',
      validate: validateRequired,
      message: 'Officer selection is required',
    },
    {
      field: 'position',
      validate: validateRequired,
      message: 'Position is required',
    },
  ];

  const errors = validateRules(assignment, baseRules);
  if (!assignment.date) return errors;

  if (assignment.officerId && assignment.shiftId) {
    // Officer availability check
    const officer = roster.officers.find(o => o.id === assignment.officerId);
    if (officer?.status === 'deployed' || officer?.status === 'fmla' || officer?.status === 'tdy' || 
        officer?.status === 'retired' || officer?.status === 'adminLeave') {
      errors.push(createError('officerId', `Cannot assign officer who is ${officer.status === 'adminLeave' ? 'on Admin Leave' : officer.status.toUpperCase()}`));
    }

    // Date range check
    const assignmentDate = new Date(assignment.date);
    const rosterStart = new Date(roster.startDate);
    const rosterEnd = new Date(roster.endDate);
    
    if (assignmentDate < rosterStart || assignmentDate > rosterEnd) {
      errors.push(createError('date', 'Assignment date must be within roster date range'));
    }

    // Conflict check
    const hasConflict = existingAssignments.some(existing => 
      existing.date === assignment.date &&
      existing.officerId === assignment.officerId
    );
    
    if (hasConflict) {
      errors.push(createError('officerId', 'Officer is already assigned to a shift on this date'));
    }

    // Consecutive days check
    const consecutiveDays = getConsecutiveWorkDays(
      assignment.officerId,
      assignment.date,
      existingAssignments
    );
    
    if (consecutiveDays >= 7) {
      errors.push(createError('date', 'Officer cannot work more than 7 consecutive days'));
    }

    // Rest period check
    const previousDayAssignment = existingAssignments.find(existing => 
      existing.officerId === assignment.officerId &&
      new Date(existing.date).getTime() === 
      assignmentDate.getTime() - 24 * 60 * 60 * 1000
    );

    if (previousDayAssignment) {
      const previousShift = roster.shifts.find(s => s.id === previousDayAssignment.shiftId);
      const newShift = roster.shifts.find(s => s.id === assignment.shiftId);

      if (previousShift && newShift) {
        const restHours = calculateRestHours(previousShift.endTime, newShift.startTime);
        if (restHours < 8) {
          errors.push(createError('shiftId', 'Minimum 8 hours rest required between shifts'));
        }
      }
    }
  }

  return errors;
};

export const formatValidationErrors = (errors: ValidationError[]): string => {
  return errors.map(error => error.message).join('\n');
};

// Export a namespace for backward compatibility
export const ValidationService = {
  validateOfficer,
  validateShift,
  validateRoster,
  validateShiftAssignment,
  formatValidationErrors,
};
