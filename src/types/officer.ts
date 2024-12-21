/**
 * @file officer.ts
 * @description Type definitions for officer-related data structures and utility functions
 */

/**
 * Officer Interface
 * Represents a police officer's complete profile information
 */
export interface Officer {
  id: string;                    // Unique identifier
  firstName: string;             // Officer's first name
  lastName: string;              // Officer's last name
  badgeNumber: string;           // Unique badge identifier
  rank: string;                  // Current rank (from RANKS const)
  zone: string;                  // Assigned zone (from ZONES const)
  sector: string;                // Assigned sector (from SECTORS const)
  isOnDesk: boolean;             // Indicates if officer is on desk duty
  specialAssignment?: string;    // Optional current special assignment
  email?: string;                // Optional contact email
  phone?: string;                // Optional contact phone
  status: 'active' | 'deployed' | 'fmla' | 'tdy' | 'retired' | 'adminLeave' | 'sick' | 'injury'; // Current duty status
  notes?: string;                // Optional additional notes
  specialAssignments: string[];  // List of special assignments/qualifications
  isActive: boolean;             // Whether officer is currently active
}

/**
 * OfficerFormData Interface
 * Represents the data structure used in officer creation/editing forms
 * Similar to Officer but with required fields for form validation
 */
export interface OfficerFormData {
  firstName: string;
  lastName: string;
  badgeNumber: string;
  rank: string;
  zone: string;
  sector: string;
  isOnDesk: boolean;
  specialAssignment: string;
  email: string;
  phone: string;
  status: 'active' | 'deployed' | 'fmla' | 'tdy' | 'retired' | 'adminLeave' | 'sick' | 'injury';
  notes: string;
  specialAssignments: string[];
  isActive: boolean;
}

/**
 * Checks if a given rank is a command rank
 * @param rank - Rank to check
 * @returns boolean indicating if the rank is a command rank
 */
export const isCommandRank = (rank: string): boolean => {
  const commandRanks = ['Sergeant', 'Senior Sergeant', 'Lieutenant', 'Senior Lieutenant', 'Captain', 'Major', 'Lieutenant Colonel', 'Colonel'];
  return commandRanks.includes(rank);
};

/**
 * Zone Interface
 * Represents a police zone/district
 */
export interface Zone {
  id: string;   // Unique zone identifier
  name: string; // Zone display name
}

/**
 * Sector Interface
 * Represents a sector within a police zone
 */
export interface Sector {
  id: string;     // Unique sector identifier
  name: string;   // Sector display name
  zoneId: string; // Associated zone ID
}

/**
 * Available police ranks in ascending order
 */
export const RANKS = [
  'Officer',
  'Officer First Class',
  'Corporal',
  'Senior Corporal',
  'Master Corporal',
  'Sergeant',
  'Senior Sergeant',
  'Lieutenant',
  'Senior Lieutenant',
  'Captain',
  'Major',
  'Lieutenant Colonel',
  'Colonel'
] as const;

/**
 * Available police zones/districts
 */
export const ZONES: Zone[] = [
  { id: 'zone1', name: '1 Zone' },
  { id: 'zone2', name: '2 Zone' },
  { id: 'zone3', name: '3 Zone' },
  { id: 'zone4', name: '4 Zone' }
];

/**
 * Available sectors mapped to their respective zones
 */
export const SECTORS: Sector[] = [
  // Zone 1 Sectors
  { id: 'sector11', name: '11', zoneId: 'zone1' },
  { id: 'sector12', name: '12', zoneId: 'zone1' },
  { id: 'sector13', name: '13', zoneId: 'zone1' },
  { id: 'sector14', name: '14', zoneId: 'zone1' },
  // Zone 2 Sectors
  { id: 'sector21', name: '21', zoneId: 'zone2' },
  { id: 'sector22', name: '22', zoneId: 'zone2' },
  { id: 'sector23', name: '23', zoneId: 'zone2' },
  { id: 'sector24', name: '24', zoneId: 'zone2' },
  // Zone 3 Sectors
  { id: 'sector31', name: '31', zoneId: 'zone3' },
  { id: 'sector32', name: '32', zoneId: 'zone3' },
  { id: 'sector33', name: '33', zoneId: 'zone3' },
  { id: 'sector34', name: '34', zoneId: 'zone3' },
  // Zone 4 Sectors
  { id: 'sector41', name: '41', zoneId: 'zone4' },
  { id: 'sector42', name: '42', zoneId: 'zone4' },
  { id: 'sector43', name: '43', zoneId: 'zone4' }
];

/**
 * Special Assignment Interface
 * Represents a special duty or qualification
 */
export interface SpecialAssignment {
  id: string;   // Unique identifier
  name: string; // Display name
}

/**
 * Available special assignments/qualifications
 */
export const SPECIAL_ASSIGNMENTS: SpecialAssignment[] = [
  { id: 'swat', name: 'SWAT' },
  { id: 'k9', name: 'K9' },
  { id: 'eds', name: 'Evidence Detection Specialist' },
  { id: 'eod', name: 'Explosive Ordnance Disposal' },
  { id: 'pcs', name: 'Property Crime Specialist' },
  { id: 'fto', name: 'FTO' },
  { id: 'vrt', name: 'Veteran Response Team' },
  { id: 'cit', name: 'Crisis Intervention' }
];

/**
 * Special teams with their full names
 */
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

/**
 * Type representing valid special team identifiers
 */
export type SpecialTeam = keyof typeof SPECIAL_TEAMS;
