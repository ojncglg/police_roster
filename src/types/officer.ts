export interface Zone {
  id: string;
  name: string;
}

export interface Sector {
  id: string;
  name: string;
  zoneId: string;
}

export interface SpecialAssignment {
  id: string;
  name: string;
  description?: string;
}

export interface Officer {
  id: string;
  badgeNumber: string;
  firstName: string;
  lastName: string;
  rank: string;
  email?: string;
  phone?: string;
  zoneId: string;
  sectorId: string;
  specialAssignments: string[]; // Array of SpecialAssignment IDs
  status: 'active' | 'inactive' | 'leave' | 'training';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const RANKS = [
  'Officer',
  'Senior Officer',
  'Corporal',
  'Sergeant',
  'Lieutenant',
  'Captain',
  'Major',
  'Deputy Chief',
  'Chief',
] as const;

export type Rank = typeof RANKS[number];

// Initial data for zones and sectors
export const ZONES: Zone[] = [
  { id: 'z1', name: 'Zone 1' },
  { id: 'z2', name: 'Zone 2' },
  { id: 'z3', name: 'Zone 3' },
  { id: 'z4', name: 'Zone 4' },
];

export const SECTORS: Sector[] = [
  { id: 's1', name: 'Sector 1', zoneId: 'z1' },
  { id: 's2', name: 'Sector 2', zoneId: 'z1' },
  { id: 's3', name: 'Sector 3', zoneId: 'z2' },
  { id: 's4', name: 'Sector 4', zoneId: 'z2' },
  { id: 's5', name: 'Sector 5', zoneId: 'z3' },
  { id: 's6', name: 'Sector 6', zoneId: 'z3' },
  { id: 's7', name: 'Sector 7', zoneId: 'z4' },
  { id: 's8', name: 'Sector 8', zoneId: 'z4' },
];

export const SPECIAL_ASSIGNMENTS: SpecialAssignment[] = [
  { id: 'sa1', name: 'K-9 Unit', description: 'Canine handling and support' },
  { id: 'sa2', name: 'SWAT', description: 'Special Weapons and Tactics' },
  { id: 'sa3', name: 'Traffic', description: 'Traffic enforcement and accident investigation' },
  { id: 'sa4', name: 'Detective', description: 'Criminal investigations' },
  { id: 'sa5', name: 'Training', description: 'Officer training and development' },
  { id: 'sa6', name: 'Community Relations', description: 'Community outreach and public relations' },
];

export interface OfficerFormData extends Omit<Officer, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}
