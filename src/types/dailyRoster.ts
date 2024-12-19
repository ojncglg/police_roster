export interface OfficerAssignment {
  name: string;
  ibm: string;
  unit: string;
  shift: string;
  assignment?: string;
  position?: string;
}

export interface DistrictSection {
  title: string;
  officers: OfficerAssignment[];
}

export interface DailyRosterProps {
  date: string;
  dayOfWeek: string;
  tour: string;
  fullStaffing: number;
  patrolToday: number;
  commandStaff: OfficerAssignment[];
  districts: DistrictSection[];
}
