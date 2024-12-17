import { Officer, Shift, ShiftAssignment, Roster } from '../types/roster';

export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationService {
  static validateOfficer(officer: Partial<Officer>): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!officer.badgeNumber) {
      errors.push({ field: 'badgeNumber', message: 'Badge number is required' });
    } else if (!/^\d{1,6}$/.test(officer.badgeNumber)) {
      errors.push({ field: 'badgeNumber', message: 'Badge number must be 1-6 digits' });
    }

    if (!officer.name) {
      errors.push({ field: 'name', message: 'Name is required' });
    } else if (officer.name.length < 2) {
      errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
    }

    if (!officer.rank) {
      errors.push({ field: 'rank', message: 'Rank is required' });
    }

    return errors;
  }

  static validateShift(shift: Partial<Shift>): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!shift.name) {
      errors.push({ field: 'name', message: 'Shift name is required' });
    }

    if (!shift.startTime) {
      errors.push({ field: 'startTime', message: 'Start time is required' });
    }

    if (!shift.endTime) {
      errors.push({ field: 'endTime', message: 'End time is required' });
    }

    if (shift.startTime && shift.endTime) {
      const start = new Date(`2000-01-01T${shift.startTime}`);
      const end = new Date(`2000-01-01T${shift.endTime}`);
      
      if (end <= start) {
        errors.push({ field: 'endTime', message: 'End time must be after start time' });
      }
    }

    return errors;
  }

  static validateRoster(roster: Partial<Roster>): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!roster.name) {
      errors.push({ field: 'name', message: 'Roster name is required' });
    }

    if (!roster.startDate) {
      errors.push({ field: 'startDate', message: 'Start date is required' });
    }

    if (!roster.endDate) {
      errors.push({ field: 'endDate', message: 'End date is required' });
    }

    if (roster.startDate && roster.endDate) {
      const start = new Date(roster.startDate);
      const end = new Date(roster.endDate);
      
      if (end < start) {
        errors.push({ field: 'endDate', message: 'End date must be after start date' });
      }
    }

    return errors;
  }

  static validateShiftAssignment(
    assignment: Partial<ShiftAssignment>,
    roster: Roster,
    existingAssignments: ShiftAssignment[]
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!assignment.date) {
      errors.push({ field: 'date', message: 'Date is required' });
      return errors; // Return early if no date
    }

    if (!assignment.shiftId) {
      errors.push({ field: 'shiftId', message: 'Shift selection is required' });
    }

    if (!assignment.officerId) {
      errors.push({ field: 'officerId', message: 'Officer selection is required' });
    }

    if (!assignment.position) {
      errors.push({ field: 'position', message: 'Position is required' });
    }

    // Check if date is within roster date range
    const assignmentDate = new Date(assignment.date);
    const rosterStart = new Date(roster.startDate);
    const rosterEnd = new Date(roster.endDate);

    if (assignmentDate < rosterStart || assignmentDate > rosterEnd) {
      errors.push({ 
        field: 'date', 
        message: 'Assignment date must be within roster date range' 
      });
    }

    // Check for conflicts
    if (assignment.officerId && assignment.shiftId) {
      const conflictingAssignment = existingAssignments.find(existing => 
        existing.date === assignment.date &&
        existing.officerId === assignment.officerId
      );

      if (conflictingAssignment) {
        errors.push({ 
          field: 'officerId', 
          message: 'Officer is already assigned to a shift on this date' 
        });
      }

      // Check for maximum consecutive days
      const consecutiveDays = this.getConsecutiveWorkDays(
        assignment.officerId,
        assignment.date,
        existingAssignments
      );

      if (consecutiveDays >= 7) {
        errors.push({ 
          field: 'date', 
          message: 'Officer cannot work more than 7 consecutive days' 
        });
      }

      // Check for minimum rest period between shifts
      const previousDayAssignment = existingAssignments.find(existing => 
        existing.officerId === assignment.officerId &&
        new Date(existing.date).getTime() === 
        assignmentDate.getTime() - 24 * 60 * 60 * 1000
      );

      if (previousDayAssignment) {
        const previousShift = roster.shifts.find(s => s.id === previousDayAssignment.shiftId);
        const newShift = roster.shifts.find(s => s.id === assignment.shiftId);

        if (previousShift && newShift) {
          const restHours = this.calculateRestHours(previousShift.endTime, newShift.startTime);
          if (restHours < 8) {
            errors.push({ 
              field: 'shiftId', 
              message: 'Minimum 8 hours rest required between shifts' 
            });
          }
        }
      }
    }

    return errors;
  }

  private static getConsecutiveWorkDays(
    officerId: string,
    date: string,
    assignments: ShiftAssignment[]
  ): number {
    const assignmentDate = new Date(date);
    let consecutiveDays = 1;
    let currentDate = new Date(assignmentDate);

    // Check previous days
    while (true) {
      currentDate.setDate(currentDate.getDate() - 1);
      const hasAssignment = assignments.some(a => 
        a.officerId === officerId && 
        new Date(a.date).getTime() === currentDate.getTime()
      );
      if (!hasAssignment) break;
      consecutiveDays++;
    }

    // Reset and check following days
    currentDate = new Date(assignmentDate);
    while (true) {
      currentDate.setDate(currentDate.getDate() + 1);
      const hasAssignment = assignments.some(a => 
        a.officerId === officerId && 
        new Date(a.date).getTime() === currentDate.getTime()
      );
      if (!hasAssignment) break;
      consecutiveDays++;
    }

    return consecutiveDays;
  }

  private static calculateRestHours(endTime: string, startTime: string): number {
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
  }

  static formatValidationErrors(errors: ValidationError[]): string {
    return errors.map(error => `${error.message}`).join('\n');
  }
}
