import type { Roster, Shift, ShiftAssignment } from '../types/roster';

// Define the shifts based on the provided schedules
const shifts: Shift[] = [
  {
    id: 'shift1',
    name: 'Early Shift',
    startTime: '16:00',
    endTime: '03:15'
  },
  {
    id: 'shift2',
    name: 'Late Shift',
    startTime: '19:00',
    endTime: '06:15'
  }
];

// Create assignments based on the provided schedule
const assignments: ShiftAssignment[] = [
  // Command Staff
  {
    shiftId: 'shift2',
    officerId: '2413',
    date: new Date().toISOString(),
    position: 'Squad Commander'
  },
  {
    shiftId: 'shift2',
    officerId: '2577',
    date: new Date().toISOString(),
    position: 'Float Sergeant'
  },
  {
    shiftId: 'shift2',
    officerId: '2784',
    date: new Date().toISOString(),
    position: 'Data Officer'
  },
  
  // District 1 (North)
  {
    shiftId: 'shift2',
    officerId: '2752',
    date: new Date().toISOString(),
    position: 'Sector 191'
  },
  {
    shiftId: 'shift1',
    officerId: '2936',
    date: new Date().toISOString(),
    position: 'Sector 12A1'
  },
  {
    shiftId: 'shift1',
    officerId: '13172',
    date: new Date().toISOString(),
    position: 'Sector 12A2'
  },
  {
    shiftId: 'shift2',
    officerId: '13162',
    date: new Date().toISOString(),
    position: 'Sector 13A1'
  },
  {
    shiftId: 'shift2',
    officerId: '13150',
    date: new Date().toISOString(),
    position: 'Sector 13A2'
  },
  {
    shiftId: 'shift2',
    officerId: '13169',
    date: new Date().toISOString(),
    position: 'Sector 14A1'
  },
  {
    shiftId: 'shift2',
    officerId: '13156',
    date: new Date().toISOString(),
    position: 'Sector 14A2'
  },
  {
    shiftId: 'shift1',
    officerId: '2718',
    date: new Date().toISOString(),
    position: 'K9-1'
  },

  // District 2 (West)
  {
    shiftId: 'shift2',
    officerId: '2880',
    date: new Date().toISOString(),
    position: 'Sector 281'
  }
];

// Create the initial roster
export const initialRoster: Omit<Roster, 'id'> = {
  name: 'Admin1 Primary Roster',
  startDate: new Date().toISOString(),
  endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(), // 30 days roster
  shifts,
  officers: [], // This will be populated from officers.ts
  assignments,
  trainingDays: []
};

// Export a function to initialize the roster in the service
export function initializeRoster(): void {
  const rosterServiceKey = 'nccpd_rosters';
  if (!localStorage.getItem(rosterServiceKey)) {
    const roster: Roster = {
      ...initialRoster,
      id: Date.now().toString()
    };
    localStorage.setItem(rosterServiceKey, JSON.stringify([roster]));
  }
}
