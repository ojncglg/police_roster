export interface Officer {
  id: string;
  firstName: string;
  lastName: string;
  badgeNumber: string;
  rank: string;
  zone: string;
  sector: string;
  specialAssignment?: string;
  email?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'leave' | 'training';
  notes?: string;
  specialAssignments: string[];
  isActive: boolean;
}

export interface OfficerFormData {
  firstName: string;
  lastName: string;
  badgeNumber: string;
  rank: string;
  zone: string;
  sector: string;
  specialAssignment: string;  // Changed from optional to required with empty string default
  email: string;              // Changed from optional to required with empty string default
  phone: string;              // Changed from optional to required with empty string default
  status: 'active' | 'inactive' | 'leave' | 'training';
  notes: string;              // Changed from optional to required with empty string default
  specialAssignments: string[];
  isActive: boolean;
}

export interface Zone {
  id: string;
  name: string;
}

export interface Sector {
  id: string;
  name: string;
  zoneId: string;
}

export const RANKS = [
  'Chief',
  'Deputy Chief',
  'Captain',
  'Lieutenant',
  'Sergeant',
  'Corporal',
  'Officer'
] as const;

export const ZONES: Zone[] = [
  { id: 'north', name: 'North' },
  { id: 'south', name: 'South' },
  { id: 'east', name: 'East' },
  { id: 'west', name: 'West' },
  { id: 'central', name: 'Central' }
];

export const SECTORS: Sector[] = [
  { id: 'sector1', name: 'Sector 1', zoneId: 'north' },
  { id: 'sector2', name: 'Sector 2', zoneId: 'north' },
  { id: 'sector3', name: 'Sector 3', zoneId: 'south' },
  { id: 'sector4', name: 'Sector 4', zoneId: 'south' },
  { id: 'sector5', name: 'Sector 5', zoneId: 'central' },
  { id: 'sector6', name: 'Sector 6', zoneId: 'central' }
];

export interface SpecialAssignment {
  id: string;
  name: string;
}

export const SPECIAL_ASSIGNMENTS: SpecialAssignment[] = [
  { id: 'k9', name: 'K9 Unit' },
  { id: 'swat', name: 'SWAT' },
  { id: 'detective', name: 'Detective' },
  { id: 'traffic', name: 'Traffic' },
  { id: 'community', name: 'Community Relations' },
  { id: 'training', name: 'Training Officer' }
];

export const SPECIAL_TEAMS = {
  SWAT: 'Special Weapons and Tactics',
  CNT: 'Crisis Negotiation Team',
  CIT: 'Crisis Intervention Team',
  CISM: 'Critical Incident Stress Management',
  MFF: 'Mobile Field Force',
  VRT: 'Veteran Response Team',
  EDS: 'Evidence Detection Specialist',
  EOD: 'Explosive Ordnance Disposal',
  PCS: 'Police Communications Specialist'
} as const;

export type SpecialTeam = keyof typeof SPECIAL_TEAMS;
