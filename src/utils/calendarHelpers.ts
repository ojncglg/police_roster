import { Roster, ShiftAssignment, Officer, Shift } from '../types/roster';

export interface CalendarDay {
  date: Date;
  assignments: (ShiftAssignment & {
    officer: Officer;
    shift: Shift;
  })[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

export const getCalendarDays = (date: Date, roster: Roster): CalendarDay[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  // Get the first day of the month
  const firstDayOfMonth = new Date(year, month, 1);
  // Get the last day of the month
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  // Get the day of the week of the first day (0-6, 0 = Sunday)
  const firstDayWeekday = firstDayOfMonth.getDay();
  
  // Calculate the first day to show in the calendar (including days from previous month)
  const calendarStart = new Date(firstDayOfMonth);
  calendarStart.setDate(calendarStart.getDate() - firstDayWeekday);
  
  const days: CalendarDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Generate 42 days (6 weeks) to ensure consistent calendar size
  for (let i = 0; i < 42; i++) {
    const currentDate = new Date(calendarStart);
    currentDate.setDate(currentDate.getDate() + i);
    
    // Get assignments for this day
    const dateString = currentDate.toISOString().split('T')[0];
    const dayAssignments = (roster.assignments || [])
      .filter(assignment => assignment.date === dateString)
      .map(assignment => ({
        ...assignment,
        officer: roster.officers.find(o => o.id === assignment.officerId)!,
        shift: roster.shifts.find(s => s.id === assignment.shiftId)!
      }));

    days.push({
      date: currentDate,
      assignments: dayAssignments,
      isCurrentMonth: currentDate.getMonth() === month,
      isToday: currentDate.getTime() === today.getTime()
    });
  }
  
  return days;
};

export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}${minutes === '00' ? '' : ':' + minutes}${ampm}`;
};

export const getMonthName = (date: Date): string => {
  return date.toLocaleString('default', { month: 'long' });
};

export const getShiftColor = (shiftName: string): string => {
  // Generate consistent colors for shifts
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-yellow-100 text-yellow-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800'
  ];
  
  // Use the shift name to consistently pick a color
  const index = shiftName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};
