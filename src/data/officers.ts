import type { Officer } from '../types/officer';

export const officers: Officer[] = [
  // Command Staff
  {
    id: '2413',
    firstName: 'ZEISSIG',
    lastName: '',
    badgeNumber: '2413',
    rank: 'S/LT.',
    zone: 'Command',
    sector: 'Command',
    specialAssignment: 'Squad Commander',
    status: 'active',
    notes: 'RET',
    specialAssignments: [],
    isActive: true
  },
  {
    id: '2577',
    firstName: 'WEGLARZ',
    lastName: '',
    badgeNumber: '2577',
    rank: 'SGT.',
    zone: 'Command',
    sector: 'Command',
    specialAssignment: 'Float Sergeant',
    status: 'active',
    notes: 'CNT/CIT',
    specialAssignments: ['CNT', 'CIT'],
    isActive: true
  },
  {
    id: '2784',
    firstName: 'GEORTLER',
    lastName: '',
    badgeNumber: '2784',
    rank: 'Officer',
    zone: 'Command',
    sector: 'Command',
    specialAssignment: 'Data Officer',
    status: 'active',
    notes: '',
    specialAssignments: [],
    isActive: true
  },

  // District 1 (North)
  {
    id: '2752',
    firstName: 'LUCAS',
    lastName: '',
    badgeNumber: '2752',
    rank: 'SGT.',
    zone: 'North',
    sector: 'Sector 191',
    specialAssignment: 'SWAT',
    status: 'active',
    notes: '',
    specialAssignments: ['SWAT'],
    isActive: true
  },
  {
    id: '2936',
    firstName: 'LOFTUS',
    lastName: '',
    badgeNumber: '2936',
    rank: 'Officer',
    zone: 'North',
    sector: 'Sector 12A1',
    specialAssignment: 'SWAT',
    status: 'active',
    notes: '',
    specialAssignments: ['SWAT'],
    isActive: true
  },
  {
    id: '13172',
    firstName: 'TOLAN',
    lastName: '',
    badgeNumber: '13172',
    rank: 'Officer',
    zone: 'North',
    sector: 'Sector 12A2',
    status: 'active',
    notes: '',
    specialAssignments: [],
    isActive: true
  },
  {
    id: '13162',
    firstName: 'BETHEA',
    lastName: '',
    badgeNumber: '13162',
    rank: 'Officer',
    zone: 'North',
    sector: 'Sector 13A1',
    status: 'active',
    notes: '',
    specialAssignments: [],
    isActive: true
  },
  {
    id: '13150',
    firstName: 'SEITLEMAN',
    lastName: '',
    badgeNumber: '13150',
    rank: 'Officer',
    zone: 'North',
    sector: 'Sector 13A2',
    status: 'active',
    notes: '',
    specialAssignments: [],
    isActive: true
  },
  {
    id: '13169',
    firstName: 'JOHNSON',
    lastName: '',
    badgeNumber: '13169',
    rank: 'Officer',
    zone: 'North',
    sector: 'Sector 14A1',
    status: 'active',
    notes: '',
    specialAssignments: [],
    isActive: true
  },
  {
    id: '13156',
    firstName: 'URBAN',
    lastName: '',
    badgeNumber: '13156',
    rank: 'Officer',
    zone: 'North',
    sector: 'Sector 14A2',
    status: 'active',
    notes: '',
    specialAssignments: [],
    isActive: true
  },
  {
    id: '2718',
    firstName: 'WILLIAMS',
    lastName: '',
    badgeNumber: '2718',
    rank: 'Officer',
    zone: 'North',
    sector: 'K9-1',
    specialAssignment: 'K9 Unit (Havoc)',
    status: 'active',
    notes: '',
    specialAssignments: ['K9'],
    isActive: true
  },

  // District 2 (West)
  {
    id: '2880',
    firstName: 'MCNASBY',
    lastName: '',
    badgeNumber: '2880',
    rank: 'SGT.',
    zone: 'West',
    sector: 'Sector 281',
    specialAssignment: '',
    status: 'active',
    notes: 'CNT/CIT',
    specialAssignments: ['CNT', 'CIT'],
    isActive: true
  }
];

// Export a function to initialize officers in the service
export function initializeOfficers(): void {
  const officerServiceKey = 'nccpd_officers';
  if (!localStorage.getItem(officerServiceKey)) {
    localStorage.setItem(officerServiceKey, JSON.stringify(officers));
  }
}
