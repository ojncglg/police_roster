import { Officer as FullOfficer } from './officer';

export type Shift = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
};

export type Officer = FullOfficer;

export type ShiftAssignment = {
  shiftId: string;
  officerId: string;
  date: string;
  position: string;
};

export type TrainingDay = {
  date: string;
  description?: string;
};

export type Roster = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  shifts: Shift[];
  officers: Officer[];
  assignments: ShiftAssignment[];
  trainingDays: TrainingDay[];
};
